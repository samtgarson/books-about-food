import { serve } from 'inngest/next'
import { getEnv } from 'shared/utils/get-env'
import { inngest } from 'src/gateways/inngest'
import { generatePalette } from 'src/gateways/inngest/generate-palette'

export default serve({
  serveHost: getEnv('NEXTAUTH_URL'),
  client: inngest,
  functions: [generatePalette]
})
