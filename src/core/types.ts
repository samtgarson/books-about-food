import { User as DbUser } from 'src/payload/payload-types'

export type UserRole = 'user' | 'admin' | 'waitlist'

export type User = Pick<DbUser, 'id' | 'name' | 'email' | 'image'> & {
  role: UserRole
  publishers: string[]
  emailVerified: boolean
}
