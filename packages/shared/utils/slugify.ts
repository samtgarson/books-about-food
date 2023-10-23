import { customAlphabet } from 'nanoid'
import Slugify from 'slugify'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 6)

export const slugify = (str: string) =>
  `${Slugify(str, { lower: true, strict: true })}-${nanoid()}`
