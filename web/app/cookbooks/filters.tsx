import { FilterSelect } from 'src/components/lists/filter-select'
import { Search } from 'src/components/lists/search'
import { Sort } from 'src/components/lists/sort'
import { FetchBooksOptions } from 'src/services/books/fetch'
import { fetchTags } from 'src/services/tags/fetch'

type CookbooksFiltersProps = {
  currentPath: string
  filters: FetchBooksOptions
}

export const CookbooksFilters = async ({
  currentPath,
  filters: { sort, tag, search }
}: CookbooksFiltersProps) => {
  const tags = await fetchTags()
  const tagFilters = tags.map((tag) => ({ label: tag.name, value: tag.name }))

  return (
    <div>
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
      <Search path={currentPath} paramName='search' currentSearch={search} />
    </div>
  )
}
