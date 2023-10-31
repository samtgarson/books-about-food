import { serve } from 'inngest/next'
import { inngest } from 'src/gateways/inngest'
import { generatePalette } from 'src/gateways/inngest/generate-palette'

// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [generatePalette]
})
