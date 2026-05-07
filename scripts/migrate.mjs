import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_REF = 'qlamlacnxbwjhhgdgdxe'
const PASSWORD = process.env.SUPABASE_DB_PASSWORD

console.log('Password length:', PASSWORD?.length, 'First char:', PASSWORD?.[0])

const HOSTS = [
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432, user: `postgres.${PROJECT_REF}` },
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 6543, user: `postgres.${PROJECT_REF}` },
  { host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432, user: 'postgres' },
]

let client
for (const cfg of HOSTS) {
  try {
    process.stdout.write(`Trying ${cfg.host}:${cfg.port} user=${cfg.user}… `)
    const c = new Client({
      ...cfg, database: 'postgres',
      password: PASSWORD,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    })
    await c.connect()
    console.log('connected!')
    client = c
    break
  } catch (err) {
    console.log(`failed: ${err.message}`)
  }
}

if (!client) {
  console.error('All connection attempts failed.')
  process.exit(1)
}

const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf8')
const seed   = readFileSync(join(__dirname, '../db/seed/initial_data.sql'), 'utf8')

console.log('Running schema.sql…')
await client.query(schema)
console.log('schema.sql ✓')

console.log('Running initial_data.sql…')
await client.query(seed)
console.log('initial_data.sql ✓')

await client.end()
console.log('\nStep 11 complete — Supabase schema deployed.')
