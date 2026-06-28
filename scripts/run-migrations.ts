// Runs Payload's bundled migrations by booting Payload, which triggers the
// Postgres adapter's `connect()`. When NODE_ENV=production and `prodMigrations`
// is set on the adapter, `connect()` applies any pending migrations from the
// statically-imported `migrations` array.
//
// We do this instead of `payload migrate` because that CLI dynamically imports
// the `.ts` migration files in an ESM loader worker that doesn't have the tsx
// loader registered, which throws ERR_UNKNOWN_FILE_EXTENSION on Node versions
// that don't strip TS types natively.
import { getPayload } from 'payload'
import config from 'src/payload.config'

async function run() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      // prodMigrations only runs in production; fail loudly rather than
      // silently skipping migrations on a misconfigured build.
      throw new Error('run-migrations.ts must be run with NODE_ENV=production')
    }

    await getPayload({ config })

    // The DB pool keeps the event loop alive; exit explicitly once migrations ran.
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void run()
