import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { ImageBlurrer } from '../lib/image-blurrer'

export const blurPlaceholder = inngest.createFunction(
  {
    id: 'blur-placeholder',
    name: 'Generate a blurry placeholder for an image'
  },
  { event: 'image.created' },
  async ({ event }) => {
    const image = await prisma.image.findUniqueOrThrow({
      where: { id: event.data.id }
    })
    const blurrer = new ImageBlurrer({ url: imageUrl(image.path) })
    const placeholderUrl = await blurrer.call()

    await prisma.image.update({
      where: { id: image.id },
      data: { placeholderUrl }
    })

    return { success: true }
  }
)
