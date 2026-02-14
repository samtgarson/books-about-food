import { User as DbUser } from 'src/payload/payload-types'

export type User = Pick<DbUser, 'id' | 'name' | 'email' | 'role' | 'image'> & {
  publishers: string[]
  emailVerified: Date | null
}
