import { Sort } from 'src/components/lists/sort'
import { Pagination } from 'src/components/lists/pagination'
import { fetchBooks, FetchBooksOptions } from 'src/services/books/fetch'
import { fetchTags } from 'src/services/tags/fetch'
import { FilterSelect } from 'src/components/lists/filter-select'
import { pathFor } from 'src/utils/path-helpers'
import { CookbookItem } from './item'

type CookbooksParams = {
  page?: string
  sort?: FetchBooksOptions['sort']
  tag?: string
}
type CookbooksProps = { searchParams: CookbooksParams }

export default async ({
  searchParams: { page: pageParam, sort, tag }
}: CookbooksProps) => {
  const page = Number(pageParam) || 0
  const { books, total, perPage } = await fetchBooks({ page, sort, tag })
  const tags = await fetchTags()
  const tagFilters = tags.map((tag) => ({ label: tag.name, value: tag.id }))
  const currentPath = pathFor('/cookbooks', { sort, tag })

  return (
    <div>
      <h1>Books</h1>
      <Sort
        sorts={{
          title: 'Title',
          releaseDate: 'Release Date',
          createdAt: 'Recently Added'
        }}
        path='/cookbooks'
        currentSort={sort ?? 'title'}
      />
      <FilterSelect
        filters={tagFilters}
        path={currentPath}
        filterName='tag'
        placeholder='All Tags'
        currentFilter={tag}
      />
      <ul className='flex flex-wrap gap-4'>
        {books.map((book) => (
          <CookbookItem key={book.id} book={book} />
        ))}
      </ul>
      {books.length === 0 && <p>No books found</p>}
      <Pagination
        total={total}
        perPage={perPage}
        page={page}
        path={currentPath}
      />
    </div>
  )
}
