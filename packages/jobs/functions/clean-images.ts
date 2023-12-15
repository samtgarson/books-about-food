import { inngest } from '..'
import { cleanImages as svc } from '../lib/clean-images'

export const cleanImages = inngest.createFunction(
  { id: 'clean-images', name: 'Clean Images' },
  { cron: '0 9 * * 1' },
  async ({ event }) => {
    const count = await svc()
    return { success: true, event, deletedImages: count }
  }
)
