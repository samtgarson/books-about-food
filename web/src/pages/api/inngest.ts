import { serve } from 'inngest/next'
import { inngest } from 'src/gateways/inngest'
import { generatePalette } from 'src/gateways/inngest/generate-palette'

export default serve({
  client: inngest,
  functions: [generatePalette]
})
