import prisma from '@books-about-food/database'
import { cache } from 'react'
import { auth } from 'src/auth'
import { User } from 'src/core/types'

export const getSessionUser = async () => {
  const session = await auth()
  if (!session?.user) return null
  return {
    ...session.user,
    role: session.user.role || 'user'
  } as User
}

export const getUser = cache(async () => {
  const sessionUser = await getSessionUser()
  if (!sessionUser) return null

  return prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { memberships: { select: { publisherId: true } } }
  })
})
