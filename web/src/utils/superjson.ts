import { Book } from 'core/models/book'
import { Contribution } from 'core/models/contribution'
import { FullBook } from 'core/models/full-book'
import { Image } from 'core/models/image'
import { Profile } from 'core/models/profile'
import { Publisher } from 'core/models/publisher'
import superjson from 'superjson'

superjson.registerClass(Book, { identifier: 'Book' })
superjson.registerClass(FullBook, { identifier: 'FullBook' })
superjson.registerClass(Image, { identifier: 'Image' })
superjson.registerClass(Profile, { identifier: 'Profile' })
superjson.registerClass(Publisher, { identifier: 'Publisher' })
superjson.registerClass(Contribution, { identifier: 'Contribution' })

export const stringify = <T>(value: T): Stringified<T> => {
  return superjson.stringify(value) as Stringified<T>
}

export const parse = <T>(value: Stringified<T>): T => {
  return superjson.parse(value)
}

export type Stringified<T> = string & { __type: T }
