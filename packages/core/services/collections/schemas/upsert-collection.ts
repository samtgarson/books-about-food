import z from 'zod'
import { array } from '../../utils/inputs'

export const upsertCollectionSchema = z.object({
  publisherSlug: z.string(),
  id: z.string().optional(),
  title: z.string(),
  bookIds: array(z.string())
})
