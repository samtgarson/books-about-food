import { Book } from 'src/models/book'
import { FullBook } from 'src/models/full-book'
import { Image } from 'src/models/image'
import { Profile } from 'src/models/profile'
import { Publisher } from 'src/models/publisher'
import superjson from 'superjson'

superjson.registerClass(Book, { identifier: 'Book' })
superjson.registerClass(FullBook, { identifier: 'FullBook' })
superjson.registerClass(Image, { identifier: 'Image' })
superjson.registerClass(Profile, { identifier: 'Profile' })
superjson.registerClass(Publisher, { identifier: 'Publisher' })

export const stringify = <T>(value: T): Stringified<T> => {
  return superjson.stringify(value) as Stringified<T>
}

export type Stringified<T> = string & { __type: T }
