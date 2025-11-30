import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import z from 'zod'
import { User } from '../../models/user'
import { AuthedService } from '../base'

export const upsertPost = new AuthedService(
  z.object({
    id: z.string(),
    title: z.string().min(1),
    content: z.string(),
    publishAt: z.coerce.date().optional()
  }),
  async function ({ id, title, content, publishAt }, currentUser) {
    const images = extractImages(content)
    const data = {
      title,
      content,
      publishAt,
      slug: slugify(title)
    }

    const post = await prisma.post.upsert({
      where: { id, authorId: currentUser.id },
      create: {
        ...data,
        id,
        authorId: currentUser.id,
        images: { connect: images.map((img) => ({ path: img })) }
      },
      update: {
        ...data,
        images: {
          set: images.map((img) => ({ path: img }))
        }
      },
      include: { author: true }
    })

    return { ...post, author: new User(post.author) }
  }
)

// extract the src attribute from any image tags in the content
function extractImages(content: string) {
  const [_, ...matches] = content.match(/<img[^>]+src="([^">]+)"/g) ?? []
  return matches
}
