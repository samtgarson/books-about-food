import { JSX } from 'react'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
export type SlugProps = PageProps<{ slug: string }>

export interface PageProps<
  Params extends Record<string, string | string[]> = never
> {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}

export function slugPage(
  pageFn: (
    slug: string,
    searchParams?: Promise<SearchParams>
  ) => Promise<JSX.Element>
) {
  return async function (props: SlugProps) {
    const { slug } = await props.params
    return pageFn(slug, props.searchParams)
  }
}
