'use server'

import { revalidatePath } from 'next/cache'
import { inngest } from 'src/core/jobs'
import { getPayloadClient } from 'src/core/services/utils/payload'
import { track } from 'src/lib/tracking/track'
import { getSessionUser } from 'src/utils/user'

export async function createVotes(bookIds: string[]) {
  const user = await getSessionUser()
  if (!user) throw new Error('User not found')

  const payload = await getPayloadClient()

  const { totalDocs: existingVotes } = await payload.count({
    collection: 'book-votes',
    where: { user: { equals: user.id } }
  })
  if (existingVotes >= 3) return

  await Promise.all(
    bookIds.map((bookId) =>
      payload.create({
        collection: 'book-votes',
        data: { book: bookId, user: user.id }
      })
    )
  )

  await track('Performed an action', {
    userId: user.id,
    Action: 'Voted on Top Ten 2024'
  })

  revalidatePath('/top-ten/2024')
}

export async function fetchVotes() {
  const user = await getSessionUser()
  if (!user) return []

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'book-votes',
    where: { user: { equals: user.id } },
    pagination: false
  })

  // Map Payload BookVotes to Prisma-compatible format for client component
  return docs.map((vote) => ({
    id: vote.id,
    userId: typeof vote.user === 'string' ? vote.user : vote.user.id,
    bookId: typeof vote.book === 'string' ? vote.book : vote.book.id,
    createdAt: new Date(vote.createdAt)
  }))
}

export async function onVote(bookIds: string[]) {
  const user = await getSessionUser()
  await track('Performed an action', {
    userId: user?.id,
    Action: 'Selected a book on Top Ten 2024',
    Extra: { 'Number of Selected Books': bookIds.length }
  })
  if (!user) return

  await inngest.send({
    name: 'votes.created',
    user,
    data: { bookIds, userId: user.id }
  })
}
