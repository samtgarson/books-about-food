import { Search } from 'src/components/lists/search'

type PublishersFiltersProps = {
  currentPath: string
  filters: { search?: string }
}

export const PublishersFilters = async ({
  currentPath,
  filters: { search }
}: PublishersFiltersProps) => {
  return <Search path={currentPath} paramName='search' currentSearch={search} />
}
