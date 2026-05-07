import { task } from '@trigger.dev/sdk/v3'
import { nim, NIM_MODELS } from '../../lib/nim'
import { firecrawl } from '../../lib/firecrawl'
import { supabaseAdmin } from '../../lib/supabase'
import type { CountryConfig } from '../country-configs/types'

const EXTRACTION_SYSTEM_PROMPT = `
You are a regulatory analyst. Given scraped content from a financial regulator's website,
extract regulatory requirements relevant to fintech operations.

Return a JSON object with key "requirements" containing an array. Each item:
{
  "title": "short descriptive title",
  "summary": "2-3 sentence plain-language summary for a Product Manager",
  "citation": "regulation name / decree number / circular ref or null",
  "risk_signals": ["foreign ownership restriction", "mandatory license"],
  "effective_date": "ISO date or null",
  "compliance_deadline": "ISO date or null",
  "source_url": "direct URL to source"
}

If no relevant requirements found, return {"requirements": []}.
`.trim()

const buildRiskPrompt = (summary: string, signals: string[], country: string, product: string) => `
Classify this fintech regulatory requirement as HIGH, MODERATE, or LOW risk.

HIGH = operational blocker: foreign entity barred, ownership restriction, no legal framework, capital > $5M USD, deadline < 90 days
MODERATE = significant burden: license with 3-12mo timeline, capital < $5M USD, data localization, material penalties
LOW = manageable: disclosure only, best-practice guidelines, simple registration

Requirement: ${summary}
Risk signals: ${signals.join(', ')}
Country: ${country} | Product: ${product}

Return JSON only: {"risk_level": "HIGH|MODERATE|LOW", "risk_reason": "one sentence"}
`.trim()

export const countryScanTask = task({
  id: 'country-scan',
  retry: { maxAttempts: 2 },

  run: async (config: CountryConfig) => {
    let changesDetected = 0

    // Log scan start
    const { data: scanLog } = await supabaseAdmin
      .from('scan_logs')
      .insert({
        country_id: config.dbId,
        started_at: new Date().toISOString(),
        status: 'RUNNING',
      })
      .select('id')
      .single()

    let pagesScraped = 0

    try {
      for (const source of config.sources) {
        // Step 1: Scrape via Firecrawl — returns clean markdown
        let content = ''
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const scraped = await (firecrawl as any).scrape(source.url, {
            formats: ['markdown'],
          })
          content = (scraped as { markdown?: string }).markdown?.slice(0, 8000) ?? ''
          pagesScraped++
        } catch (err) {
          console.warn(`Firecrawl failed for ${source.url}:`, err)
          continue
        }

        if (!content.trim()) continue

        // Step 2: Extract requirements via NIM Llama 3.3 70B
        let requirements: Array<{
          title: string
          summary: string
          citation: string | null
          risk_signals: string[]
          effective_date: string | null
          compliance_deadline: string | null
          source_url: string
        }> = []

        try {
          const extractionResponse = await nim.chat.completions.create({
            model: NIM_MODELS.extraction,
            messages: [
              { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Product vertical: ${source.productVertical}\n\nContent:\n${content}`,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
          })

          const parsed = JSON.parse(
            extractionResponse.choices[0].message.content ?? '{}'
          )
          requirements = Array.isArray(parsed.requirements)
            ? parsed.requirements
            : Array.isArray(parsed)
            ? parsed
            : []
        } catch (err) {
          console.warn(`Extraction failed for ${source.url}:`, err)
          continue
        }

        for (const req of requirements) {
          // Step 3: Classify risk via NIM Llama 3.1 8B
          let riskLevel = 'UNKNOWN'
          let riskReason: string | null = null

          try {
            const classRes = await nim.chat.completions.create({
              model: NIM_MODELS.classification,
              messages: [
                {
                  role: 'user',
                  content: buildRiskPrompt(
                    req.summary,
                    req.risk_signals ?? [],
                    config.name,
                    source.productVertical
                  ),
                },
              ],
              response_format: { type: 'json_object' },
              temperature: 0,
            })

            const cls = JSON.parse(classRes.choices[0].message.content ?? '{}')
            riskLevel = cls.risk_level ?? 'UNKNOWN'
            riskReason = cls.risk_reason ?? null
          } catch (err) {
            console.warn('Risk classification failed:', err)
          }

          // Step 4: Generate embedding via nvidia/nv-embed-v2
          let embedding: number[] | null = null
          try {
            const embRes = await nim.embeddings.create({
              model: NIM_MODELS.embedding,
              input: `${req.title}. ${req.summary}`,
            })
            embedding = embRes.data[0].embedding
          } catch (err) {
            console.warn('Embedding failed:', err)
          }

          // Step 5: Diff + upsert
          const { data: existing } = await supabaseAdmin
            .from('regulatory_requirements')
            .select('id, risk_level, summary')
            .eq('country_id', config.dbId)
            .eq('product_vertical_id', source.productVerticalDbId)
            .eq('regulator_id', source.regulatorDbId)
            .maybeSingle()

          const newData = {
            country_id: config.dbId,
            product_vertical_id: source.productVerticalDbId,
            regulator_id: source.regulatorDbId,
            risk_level: riskLevel,
            risk_reason: riskReason,
            title: req.title,
            summary: req.summary,
            citation: req.citation,
            source_url: req.source_url ?? source.url,
            effective_date: req.effective_date,
            compliance_deadline: req.compliance_deadline,
            last_verified_at: new Date().toISOString(),
            ...(embedding ? { embedding: JSON.stringify(embedding) } : {}),
          }

          if (!existing) {
            const { data: inserted } = await supabaseAdmin
              .from('regulatory_requirements')
              .insert(newData)
              .select('id')
              .single()

            if (inserted) {
              await supabaseAdmin.from('changelogs').insert({
                requirement_id: inserted.id,
                change_type: 'ADDED',
                new_value: newData,
                change_summary: `New requirement added: ${req.title}`,
                source_url: req.source_url ?? source.url,
              })
              changesDetected++
            }
          } else {
            const riskChanged = existing.risk_level !== riskLevel
            const summaryChanged = existing.summary !== req.summary

            if (riskChanged || summaryChanged) {
              await supabaseAdmin
                .from('regulatory_requirements')
                .update(newData)
                .eq('id', existing.id)

              const changeType = riskChanged ? 'RISK_CHANGED' : 'UPDATED'
              const changeSummary = riskChanged
                ? `Risk changed ${existing.risk_level} → ${riskLevel}: ${req.title}`
                : `Content updated: ${req.title}`

              await supabaseAdmin.from('changelogs').insert({
                requirement_id: existing.id,
                change_type: changeType,
                old_value: { risk_level: existing.risk_level, summary: existing.summary },
                new_value: { risk_level: riskLevel, summary: req.summary },
                change_summary: changeSummary,
                source_url: req.source_url ?? source.url,
              })
              changesDetected++
            } else {
              // No change — just update last_verified_at
              await supabaseAdmin
                .from('regulatory_requirements')
                .update({ last_verified_at: new Date().toISOString() })
                .eq('id', existing.id)
            }
          }
        }
      }

      // Update scan log — completed
      if (scanLog?.id) {
        await supabaseAdmin
          .from('scan_logs')
          .update({
            completed_at: new Date().toISOString(),
            status: 'COMPLETED',
            pages_scraped: pagesScraped,
            changes_detected: changesDetected,
          })
          .eq('id', scanLog.id)
      }
    } catch (err) {
      if (scanLog?.id) {
        await supabaseAdmin
          .from('scan_logs')
          .update({
            completed_at: new Date().toISOString(),
            status: 'FAILED',
            pages_scraped: pagesScraped,
            error_message: String(err),
          })
          .eq('id', scanLog.id)
      }
      throw err
    }

    return { country: config.code, changesDetected }
  },
})
