import { appUrl } from '@books-about-food/core/utils/app-url'
import { PageProps } from 'src/components/types'
import { z } from 'zod'

export function indexPageMetadata<Input extends z.ZodTypeAny>({
  title: pageTitle,
  path,
  schema
}: {
  title: string
  path: string
  schema: Input
}) {
  return async function generateMetadata({ searchParams }: PageProps) {
    const { page } = schema.parse(searchParams)
    const canonical = page ? `${path}?page=${page}` : path
    const title = page ? `${pageTitle} (Page ${page + 1})` : pageTitle

    const links = []
    if (page) {
      if (page > 1) {
        links.push({
          rel: 'prev',
          url: `${appUrl()}/cookbooks?page=${page - 1}`
        })
      }
      links.push({ rel: 'next', url: `${appUrl()}/cookbooks?page=${page + 1}` })
    }

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
