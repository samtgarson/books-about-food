import { User } from '@books-about-food/core/types'
import prisma from '@books-about-food/database'
import { cache } from 'react'
import { auth } from 'src/auth'

export const getSessionUser = cache(async () => {
  const session = await auth()
  if (!session?.user) return null
  return {
    ...session.user,
    role: session.user.role || 'user',
    teams: []
  } as User
})

export const getUser = cache(async () => {
  const sessionUser = await getSessionUser()
  if (!sessionUser) return null

  return prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { memberships: { select: { teamId: true } } }
  })
})
