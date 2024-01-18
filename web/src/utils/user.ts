import prisma from '@books-about-food/database'
import { cache } from 'react'
import { auth } from 'src/auth'

export const getSessionUser = cache(async () => {
  const session = await auth()
  if (!session?.user) return null
  return {
    ...session.user,
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
    role: session.user.role || 'waitlist'
  }
})

export const getUser = cache(async () => {
  const sessionUser = await getSessionUser()
  if (!sessionUser) return null

  return prisma.user.findUnique({ where: { id: sessionUser.id } })
})
