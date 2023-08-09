import { JWT } from 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
import { UserRole } from 'database'

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    role: UserRole
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User extends DefaultSession['user'] {
    role: UserRole
  }
}
