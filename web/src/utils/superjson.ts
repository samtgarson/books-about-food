import { Book, FullBook } from 'src/models/book'
import { Image } from 'src/models/image'
import { Profile } from 'src/models/profile'
import { Publisher } from 'src/models/publisher'
import superjson from 'superjson'

superjson.registerClass(Book)
superjson.registerClass(FullBook)
superjson.registerClass(Image)
superjson.registerClass(Profile)
superjson.registerClass(Publisher)
