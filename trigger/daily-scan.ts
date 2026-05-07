import { schedules } from '@trigger.dev/sdk/v3'
import { ALL_COUNTRY_CONFIGS } from './country-configs'
import { countryScanTask } from './tasks/country-scan'

// Schedule lives here in code — no Vercel Cron, no external trigger needed
export const dailyScan = schedules.task({
  id: 'daily-regulatory-scan',
  cron: '0 6 * * *',  // 06:00 UTC daily

  run: async () => {
    console.log(`Daily scan starting — ${ALL_COUNTRY_CONFIGS.length} ASEAN countries`)

    // Fan-out: trigger all 6 country tasks in parallel
    const batchItems = ALL_COUNTRY_CONFIGS.map(config => ({
      payload: config,
    }))

    const results = await countryScanTask.batchTriggerAndWait(batchItems)

    const totalChanges = results.runs
      .filter(r => r.ok)
      .reduce((sum, r) => sum + (r.output?.changesDetected ?? 0), 0)

    const failed = results.runs.filter(r => !r.ok).length

    console.log(`Scan complete. Changes: ${totalChanges}, Failed: ${failed}`)
    return { totalChanges, failed }
  },
})
