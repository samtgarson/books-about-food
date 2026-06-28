// Boots Payload so the adapter's connect() runs the bundled prodMigrations,
// avoiding `payload migrate` which loads .ts migrations in a worker without tsx.
import { getPayload } from 'payload'
import config from 'src/payload.config'

async function run() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('run-migrations.ts must be run with NODE_ENV=production')
    }

    await getPayload({ config })

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void run()
