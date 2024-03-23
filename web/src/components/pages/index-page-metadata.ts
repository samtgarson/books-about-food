import { Service } from '@books-about-food/core/services/base'
import { appUrl } from '@books-about-food/core/utils/app-url'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'

export function indexPageMetadata<Svc extends Service<any, any>>({
  title: pageTitle,
  path,
  service
}: {
  title: string
  path: string
  service: Svc
}) {
  return async function generateMetadata({ searchParams }: PageProps) {
    const parsed = service.input.parse(searchParams)
    const { page } = parsed
    const canonical = page ? `${path}?page=${page}` : path
    const title = page ? `${pageTitle} (Page ${page + 1})` : pageTitle
    const links = await getLinks(page, service, parsed)

    return {
      title,
      description: `Browse ${pageTitle.toLowerCase()} on Books About Food.`,
      alternates: {
        canonical
      },
      icons: links.length
        ? {
            other: links
          }
        : undefined
    }
  }
}

async function getLinks(page: number, service: Service<any, any>, parsed: any) {
  const links = []
  if (!page) return []
  if (page > 1) {
    links.push({
      rel: 'prev',
      url: `${appUrl()}/cookbooks?page=${page - 1}`
    })
  }

  const { data } = await call(service, parsed)
  if (data.filteredTotal && data.perPage) {
    const isLastPage = data.filteredTotal <= (page + 1) * data.perPage
    if (!isLastPage) {
      links.push({
        rel: 'next',
        url: `${appUrl()}/cookbooks?page=${page + 1}`
      })
    }
  }

  return links
}
