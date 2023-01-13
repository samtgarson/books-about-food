import { ServerRender } from 'src/components/util/server-render'
import { fetchBooks } from 'src/services/books/fetch-books'
import { FetchProvider } from 'src/contexts/fetcher'
import { ReactNode } from 'react'
import { fetcherData } from 'src/utils/fetcher-helpers'

export default async ({ children }: { children: ReactNode }) => {
  const books = await fetchBooks.call()

  return (
    <ServerRender
      component={FetchProvider}
      data={[fetcherData('books', books)]}
    >
      {children}
    </ServerRender>
  )
}
