import { Book, FullBook } from 'src/models/book'
import { Image } from 'src/models/image'
import { Profile } from 'src/models/profile'
import { Publisher } from 'src/models/publisher'
import superjson from 'superjson'

superjson.registerClass(Book, { identifier: 'Book' })
superjson.registerClass(FullBook, { identifier: 'FullBook' })
superjson.registerClass(Image, { identifier: 'Image' })
superjson.registerClass(Profile, { identifier: 'Profile' })
superjson.registerClass(Publisher, { identifier: 'Publisher' })
