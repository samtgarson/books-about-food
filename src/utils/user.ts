import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from 'src/auth'
import { User, UserRole } from 'src/core/types'

type SessionUser = {
  id: string
  name: string
  email: string
  role?: UserRole | UserRole[] | null
  image?: string | null
  publishers?: string[]
  emailVerified: boolean
}

export const getSessionUser = cache(async (): Promise<User | null> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user) return null

  const user = session.user as SessionUser

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: extractRole(user.role),
    image: user.image ?? null,
    publishers: user.publishers ?? [],
    emailVerified: user.emailVerified
  }
})

function extractRole(role: UserRole | UserRole[] | null | undefined): UserRole {
  if (Array.isArray(role)) return role[0] ?? 'user'
  return role ?? 'user'
}
