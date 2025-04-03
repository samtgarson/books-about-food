import {
  ServiceClass,
  ServiceInput
} from '@books-about-food/core/services/base'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Metadata, ResolvedMetadata } from 'next'
import { PageProps } from 'src/components/types'
import { genMetadata } from 'src/utils/metadata'
import { call } from 'src/utils/service'
import { z } from 'zod'

type Result = { total: number; filteredTotal: number; perPage: number | 'all' }

export function indexPageMetadata<
  Svc extends ServiceClass<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  I extends z.ZodType<ServiceInput<Svc>>
>({
  title: pageTitle,
  collection,
  path,
  service,
  image = false,
  extraParams
}: {
  title: string
  collection: string
  path: string
  service: Svc
  image?: boolean
  extraParams?: z.infer<I>
}) {
  return async function generateMetadata(
    { searchParams }: PageProps,
    parent: Promise<ResolvedMetadata>
  ): Promise<Metadata> {
    const parsed = {
      ...extraParams,
      ...(service.input as I).parse(await searchParams)
    } as z.infer<Svc['input']>
    const { page } = parsed as { page?: number }
    const canonical = page ? `${path}?page=${page}` : path
    const title = page ? `${pageTitle} (Page ${page + 1})` : pageTitle
    const { data } = (await call(service, parsed)) as { data: Result }
    const links = getLinks(page ?? 0, data)
    const count = data
      ? Math.floor(data.total / 100) * 100
      : 'our collection of'

    return genMetadata(canonical, await parent, {
      title,
      description: `Browse through more than ${count} ${collection} on Books About Food — the cookbook industry's new digital home.`,
      icons: links.length ? { other: links } : undefined,
      image: image ? `${path}/meta/og-image.png` : undefined
    })
  }
}

function getLinks(page: number, data?: Result) {
  const links = []
  if (!page) return []
  if (page > 1) {
    links.push({
      rel: 'prev',
      url: `${appUrl()}/cookbooks?page=${page - 1}`
    })
  }

  if (data) {
    const isLastPage =
      data.perPage === 'all'
        ? true
        : data.filteredTotal <= (page + 1) * data.perPage
    if (!isLastPage) {
      links.push({
        rel: 'next',
        url: `${appUrl()}/cookbooks?page=${page + 1}`
      })
    }
  }

  return links
}
