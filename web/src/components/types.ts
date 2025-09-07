import { AppRoutes } from '.next/types/routes'
import { JSX } from 'react'

export function slugPage<Path extends AppRoutes>(
  pageFn: (slug: string) => Promise<JSX.Element>
) {
  return async function (props: PageProps<Path>) {
    const params = await props.params
    if ('slug' in params && typeof params.slug === 'string') {
      return pageFn(params.slug)
    }

    throw new Error('slugPage requires a slug parameter in the route')
  }
}
