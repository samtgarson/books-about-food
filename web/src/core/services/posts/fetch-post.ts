import prisma from '@books-about-food/database'
import z from 'zod'
import { Post } from '../../models/post'
import { AuthedService } from '../base'

export const fetchPost = new AuthedService(
  z.object({ slug: z.string() }),
  async function fetchPost({ slug }, _ctx) {
    const found = await prisma.post.findUnique({
      where: { slug }
    })

    if (found) return new Post(found)
  },
  { admin: true }
)
