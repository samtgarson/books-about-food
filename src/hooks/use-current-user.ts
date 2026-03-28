import { User, UserRole } from 'src/core/types'
import { authClient } from 'src/lib/auth/client'

type SessionUser = {
  id: string
  name: string
  email: string
  role?: UserRole | UserRole[] | null
  image?: string | null
  publishers?: string[]
  emailVerified: boolean
}

export function useCurrentUser(): User | null {
  const session = authClient.useSession()
  if (!session.data?.user) return null

  const user = session.data.user as SessionUser
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: extractRole(user.role),
    image: user.image ?? null,
    publishers: user.publishers ?? [],
    emailVerified: user.emailVerified
  }
}

function extractRole(role: UserRole | UserRole[] | null | undefined): UserRole {
  if (Array.isArray(role)) return role[0] ?? 'user'
  return role ?? 'user'
}
