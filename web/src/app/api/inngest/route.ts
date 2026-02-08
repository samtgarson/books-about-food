import { serve } from 'inngest/next'
import { inngest } from 'src/jobs'
import { functions } from 'src/jobs/functions'

export const { GET, POST, PUT } = serve({ client: inngest, functions })
