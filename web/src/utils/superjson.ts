import { Book } from '@books-about-food/core/models/book'
import { Contribution } from '@books-about-food/core/models/contribution'
import { FullBook } from '@books-about-food/core/models/full-book'
import { Image } from '@books-about-food/core/models/image'
import { Profile } from '@books-about-food/core/models/profile'
import { Publisher } from '@books-about-food/core/models/publisher'
import { Team } from '@books-about-food/core/models/team'
import superjson from 'superjson'

superjson.registerClass(Book, { identifier: 'Book' })
superjson.registerClass(FullBook, { identifier: 'FullBook' })
superjson.registerClass(Image, { identifier: 'Image' })
superjson.registerClass(Profile, { identifier: 'Profile' })
superjson.registerClass(Publisher, { identifier: 'Publisher' })
superjson.registerClass(Contribution, { identifier: 'Contribution' })
superjson.registerClass(Team, { identifier: 'Team' })

export const stringify = <T>(value: T): Stringified<T> => {
  return superjson.stringify(value) as Stringified<T>
}

export const parse = <T>(value: Stringified<T>): T => {
  return superjson.parse(value)
}

export type Stringified<T> = string & { __type: T }
