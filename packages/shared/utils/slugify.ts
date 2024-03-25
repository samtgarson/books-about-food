import Slugify from 'slugify'
import { customRandom } from './nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoid = customRandom(alphabet, 6)

export const slugify = (
  str: string,
  { withHash = true }: { withHash?: boolean } = {}
) => {
  const slug = Slugify(str, { lower: true, strict: true })
  if (withHash) return `${slug}-${nanoid()}`
  return slug
}
