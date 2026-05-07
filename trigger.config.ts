import { defineConfig } from '@trigger.dev/sdk/v3'

export default defineConfig({
  project: 'proj_duwouukfviywfimokskp',
  dirs: ['./trigger'],
  maxDuration: 3600, // 1 hour — country scans can run long
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
})
