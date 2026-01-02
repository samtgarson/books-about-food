import z from 'zod'
import { Post } from '../../models/post'
import { AuthedService } from '../base'

export const fetchPost = new AuthedService(
  z.object({ slug: z.string() }),
  async function fetchPost({ slug }, { payload, user }) {
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      user
    })

    if (docs[0]) return new Post(docs[0])
  },
  { admin: true }
)
