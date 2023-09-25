import prisma from 'database'
import { contentType } from 'mime-types'
import { slugify } from 'shared/utils/slugify'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { createImages } from '../images/create-images'
import { fetchLibraryBook } from './library/fetch-library-book'

export type CreateBookInput = z.infer<typeof createBook.input>

export const createBook = new Service(
  z
    .object({
      title: z.string(),
      googleBooksId: z.never().optional()
    })
    .or(z.object({ googleBooksId: z.string(), title: z.never().optional() })),
  async ({ title, googleBooksId } = {}, user) => {
    if (!user) throw new Error('User is required')

    if (title)
      return prisma.book.create({
        data: { title, slug: slugify(title), submitterId: user.id }
      })

    if (!googleBooksId) throw new Error('Title or Google Books ID is required')

    const { data: libraryBook } = await fetchLibraryBook.call({
      id: googleBooksId
    })
    if (!libraryBook) throw new Error('Book not found')

    const {
      id,
      publisher: publisherName,
      authors: authorNames,
      cover: coverUrl,
      ...attrs
    } = libraryBook

    return prisma.$transaction(async (tx) => {
      const [publisher, cover, ...authors] = await Promise.all([
        findOrCreatePublisher(publisherName),
        createImage(coverUrl),
        ...authorNames.map((name) => findOrCreateAuthor(name))
      ])

      return tx.book.create({
        data: {
          ...attrs,
          googleBooksId: id,
          slug: slugify(attrs.title),
          submitterId: user.id,
          publisherId: publisher?.id,
          coverImage: cover ? { connect: { id: cover?.id } } : undefined,
          authors: {
            connect: authors.flatMap((p) => (p ? [{ id: p.id }] : []))
          }
        }
      })

      async function findOrCreatePublisher(name?: string) {
        if (!name) return undefined
        return tx.publisher.upsert({
          where: { name },
          create: { name, slug: slugify(name) },
          update: {}
        })
      }

      async function findOrCreateAuthor(name?: string) {
        if (!name) return undefined
        return tx.profile.upsert({
          where: { name },
          create: { name, slug: slugify(name) },
          update: {}
        })
      }
    })
  }
)

async function createImage(url?: string) {
  if (!url) return undefined

  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())
  const type =
    contentType(res.headers.get('content-type') || 'image/jpeg') || 'image/jpeg'
  const { data } = await createImages.call({
    files: [{ buffer, type }],
    prefix: 'book-covers'
  })
  if (data) return data[0]
}
