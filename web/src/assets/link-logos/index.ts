import { websites } from '@books-about-food/shared/data/websites'
import { StaticImageData } from 'next/image'
import abebooks from './Abe Books.png'
import amazon from './Amazon.png'
import bookshop from './Bookshop.png'
import edelweiss from './Edelweiss.png'
import worldcat from './Worldcat.png'

export const linkLogos: Record<(typeof websites)[number], StaticImageData> = {
  Amazon: amazon,
  'Bookshop.org': bookshop,
  'Edelweiss+': edelweiss,
  AbeBooks: abebooks,
  Worldcat: worldcat
}
