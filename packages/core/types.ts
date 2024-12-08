import { User as DbUser } from '@books-about-food/database'

export type User = Pick<DbUser, 'id' | 'name' | 'email' | 'image' | 'role'> & {
  publishers: string[]
}
