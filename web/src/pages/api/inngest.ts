import { inngest } from 'core/gateways/inngest'
import { functions } from 'core/gateways/inngest/functions'
import { serve } from 'inngest/next'
import { getEnv } from 'shared/utils/get-env'

export default serve({
  serveHost: getEnv('NEXTAUTH_URL'),
  client: inngest,
  functions
})
