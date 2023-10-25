import Slugify from 'slugify'
import { customRandom } from './nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoid = customRandom(alphabet, 6)

export const slugify = (str: string) =>
  `${Slugify(str, { lower: true, strict: true })}-${nanoid()}`
