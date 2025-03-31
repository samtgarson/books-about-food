import { Book } from '@books-about-food/core/models/book'
import { Collection } from '@books-about-food/core/models/collection'
import { Contribution } from '@books-about-food/core/models/contribution'
import { FullBook } from '@books-about-food/core/models/full-book'
import { Image } from '@books-about-food/core/models/image'
import { Profile } from '@books-about-food/core/models/profile'
import { Publisher } from '@books-about-food/core/models/publisher'
import {
  registerClass,
  parse as sjParse,
  stringify as sjStringify
} from 'superjson'

registerClass(Book, { identifier: 'Book' })
registerClass(FullBook, { identifier: 'FullBook' })
registerClass(Image, { identifier: 'Image' })
registerClass(Profile, { identifier: 'Profile' })
registerClass(Publisher, { identifier: 'Publisher' })
registerClass(Contribution, { identifier: 'Contribution' })
registerClass(Collection, { identifier: 'Collection' })

export const stringify = <T>(value: T): Stringified<T> => {
  return sjStringify(value) as Stringified<T>
}

export const parse = <T>(value: Stringified<T>): T => {
  return sjParse(value)
}

export type Stringified<T> = string & { __type: T }
