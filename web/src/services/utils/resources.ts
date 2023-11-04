import prisma from 'database'
import { slugify } from 'inngest'
import { contentType } from 'mime-types'
import { Profile } from 'src/models/profile'
import { profileIncludes } from '.'
import { createImages } from '../images/create-images'

export async function findOrCreateAuthor(name?: string) {
  if (!name) return undefined
  const found = await prisma.profile.findMany({
    where: { name },
    include: profileIncludes
  })
  if (found.length > 1) return undefined
  if (found.length) return new Profile(found[0])

  const created = await prisma.profile.create({
    data: { name, slug: slugify(name) },
    include: profileIncludes
  })
  return new Profile(created)
}

export async function createImage(url?: string) {
  if (!url) return undefined

  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())
  const type =
    contentType(res.headers.get('content-type') || 'image/jpeg') || 'image/jpeg'
  const { data } = await createImages.call({
    files: [{ buffer, type }],
    prefix: 'book-covers'
  })
  if (data) return data[0].id
}
