'use server'

import prisma from '@books-about-food/database'
import { getSessionUser } from 'src/utils/user'

export async function createVotes(bookIds: string[]) {
  const user = await getSessionUser()
  if (!user) throw new Error('User not found')

  const existingVotes = await prisma.bookVote.count({
    where: { userId: user.id }
  })
  if (existingVotes >= 3) return

  await prisma.bookVote.createMany({
    data: bookIds.map((bookId) => ({ bookId, userId: user.id }))
  })
}

export async function fetchVotes() {
  const user = await getSessionUser()
  if (!user) throw new Error('User not found')

  return prisma.bookVote.findMany({
    where: { userId: user.id }
  })
}
