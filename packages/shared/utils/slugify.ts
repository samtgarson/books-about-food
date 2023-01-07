import Slugify from 'slugify'

export const slugify = (str: string) =>
  Slugify(str, { lower: true, strict: true })
