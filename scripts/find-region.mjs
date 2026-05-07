import pg from 'pg'

const { Client } = pg
const PROJECT_REF = 'qlamlacnxbwjhhgdgdxe'
const PASSWORD = process.env.SUPABASE_DB_PASSWORD

const REGIONS = [
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
  'ap-south-1', 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-north-1',
  'sa-east-1', 'ca-central-1',
]

for (const region of REGIONS) {
  const host = `aws-0-${region}.pooler.supabase.com`
  for (const port of [5432, 6543]) {
    const c = new Client({
      host, port, database: 'postgres',
      user: `postgres.${PROJECT_REF}`,
      password: PASSWORD,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000,
    })
    try {
      await c.connect()
      console.log(`\n✅ FOUND: ${region}:${port}`)
      await c.end()
      process.exit(0)
    } catch (err) {
      process.stdout.write(`${region}:${port}=${err.message.slice(0, 40)} | `)
    }
  }
}
console.log('\nNo region found.')
