'use server'

import { inngest } from '@books-about-food/core/jobs'
import prisma from '@books-about-food/database'
import { revalidatePath } from 'next/cache'
import { track } from 'src/lib/tracking/track'
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

  await track('Performed an action', {
    Action: 'Voted on Top Ten 2024'
  })

  revalidatePath('/top-ten/2024')
}

export async function fetchVotes() {
  const user = await getSessionUser()
  if (!user) return []

  return prisma.bookVote.findMany({
    where: { userId: user.id }
  })
}

export async function onVote(bookIds: string[]) {
  await track('Performed an action', {
    Action: 'Selected a book on Top Ten 2024',
    Extra: { 'Number of Selected Books': bookIds.length }
  })
  const user = await getSessionUser()
  if (!user) return

  await inngest.send({
    name: 'votes.created',
    user,
    data: { bookIds, userId: user.id }
  })
}
