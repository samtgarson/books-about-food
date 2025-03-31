import { AuthedService } from '@books-about-food/core/services/base'
import {
  UpdateBookInput,
  updateBook
} from '@books-about-food/core/services/books/update-book'
import { updateLinks } from '@books-about-food/core/services/books/update-links'
import { createImages } from '@books-about-food/core/services/images/create-images'
import { findOrCreateProfile } from '@books-about-food/core/services/profiles/find-or-create-profile'
import { AppError } from '@books-about-food/core/services/utils/errors'
import { User } from '@books-about-food/core/types'
import prisma from '@books-about-food/database'
import { getEnv } from '@books-about-food/shared/utils/get-env'
import { parse } from 'date-fns'
import { openBrowser } from 'lib/utils/browser'
import { Page } from 'playwright-chromium'
import z from 'zod'

export const edelweissImport = new AuthedService(
  z.object({
    url: z
      .string()
      .url()
      .refine((url) => new URL(url).hostname.endsWith('edelweiss.plus'), {
        message: 'URL must be from edelweiss.plus'
      })
  }),
  async function ({ url } = {}, user) {
    const browser = await openBrowser()
    const context = await browser.newContext({ locale: 'en-GB' })
    context.setDefaultTimeout(7500)
    await context.addCookies([edelweissSession()])
    const page: Page = await context.newPage()
    await page.goto(url)

    try {
      await page.waitForSelector('.pve_title', { state: 'visible' })
    } catch {
      throw new AppError('ServerError', 'Could not load Edelweiss+ page')
    }

    const attrs = await generateAttrs(page, user)
    await browser.close()

    if (attrs instanceof Error) {
      throw new AppError(
        'ServerError',
        `Could not parse Edelweiss+ page: ${attrs.message}`
      )
    }

    const res = await updateBook.call(attrs, user)
    if (!res.success) throw new Error('Failed to update book', { cause: res })

    const book = res.data
    await updateLinks.call(
      { slug: book.slug, links: [{ site: 'Edelweiss+', url }] },
      user
    )

    return book
  }
)

const edelweissSession = () => ({
  name: 'treeline.session',
  value: getEnv('EDELWEISS_SESSION'),
  domain: '.edelweiss.plus',
  path: '/',
  secure: true
})

async function generateAttrs(page: Page, user: User) {
  try {
    const attrs: UpdateBookInput = {
      id: crypto.randomUUID(),
      title: '',
      source: 'edelweiss'
    }
    const title = await textContent(page, '[id^=title] .textLarge')
    if (!title) throw new Error('Could not find title')
    attrs.title = title
    attrs.subtitle = await textContent(page, '[id^=title] .pve_subName')
    attrs.pages = await getPages(page)
    attrs.authorIds = await getAuthors(page, user)
    attrs.publisherId = await getPublisher(page)
    attrs.releaseDate = await getReleaseDate(page)

    attrs.coverImageId = (
      await getImages(page, '.maincover', `books/${attrs.id}/cover`)
    )[0]
    attrs.previewImageIds = await getImages(
      page,
      '.illustrations-container',
      `books/${attrs.id}/previews`
    )

    return attrs
  } catch (e) {
    return e as Error
  }
}

async function textContent(page: Page | null, selector: string) {
  const el = await page?.$(selector)
  const text = await el?.textContent()
  if (!text) return undefined
  return text.replace(/^:/, '').trim()
}

async function getPages(page: Page) {
  const pagesLabel = await textContent(page, '.pve_numberOfPages')
  const number = pagesLabel?.match(/[0-9]+/)?.[0]
  if (number) return parseInt(number)
}

async function getAuthors(page: Page, user: User) {
  const authorNames = await textContent(page, '.title_Author')
  if (!authorNames) return undefined
  const profiles = await Promise.all(
    authorNames.split(', ').map(async (name) => {
      const { data } = await findOrCreateProfile.call({ name }, user)
      return data?.id
    })
  )

  return profiles.filter((id): id is string => !!id)
}

async function getImages(page: Page, selector: string, prefix: string) {
  const els = await page.$$(`${selector} img`)
  if (!els.length) return []

  const src = await Promise.all(
    els.map(async function (el) {
      const rawSrc = await el.getAttribute('src')
      if (!rawSrc) return
      return rawSrc.split('?')[0]
    })
  )

  const { data = [] } = await createImages.call({
    prefix,
    files: src.flatMap((url) => (url ? { url } : []))
  })
  return data.map(({ id }) => id)
}

async function getPublisher(page: Page) {
  const text = await textContent(page, '.headerImprint')
  const name = text?.replace(/1. /, '').trim()
  if (!name) return undefined

  const publisher = await prisma.publisher.findUnique({
    where: { name },
    select: { id: true }
  })
  return publisher?.id
}

async function getReleaseDate(page: Page) {
  const text = await textContent(page, '.pve_shipDate ')
  if (!text) return undefined

  const dateStr = text.match(/.+?([0-9].+)/)?.[1]
  if (!dateStr) return undefined
  return parse(dateStr + ' Z', 'dd MMMM yyyy X', new Date())
}
