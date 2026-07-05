import { Service } from 'src/core/services/base'
import { z } from 'zod'

export type GetImagesInput = z.infer<typeof getImages.input>

export const getImages = new Service(
  z.object({ ids: z.array(z.string()) }),
  async ({ ids }, { payload }) => {
    if (!ids.length) return []

    const { docs } = await payload.find({
      collection: 'images',
      where: { id: { in: ids } },
      depth: 0,
      pagination: false
    })

    return docs
  },
  { cache: false }
)
