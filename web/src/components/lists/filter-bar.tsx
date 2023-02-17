import { FC, useRef, useState } from 'react'
import { Search, X } from 'react-feather'
import { AntiContainer, Container } from '../atoms/container'
import { PageTitle } from '../atoms/page-title'

export type FilterBarProps = {
  children?: React.ReactNode
  search?: React.ReactNode
  label?: string
  title?: string
}

export const FilterBar: FC<FilterBarProps> = ({
  children,
  search,
  label = 'Sort & Filter',
  title
}) => {
  const [showSearch, setShowSearch] = useState(false)
  const searchWrapper = useRef<HTMLDivElement>(null)

  const showSearchAndFocus = () => {
    setShowSearch(true)
    setTimeout(() => {
      searchWrapper.current?.querySelector('input')?.focus()
    })
  }

  return (
    <>
      {title &&
        search &&
        (showSearch ? (
          <div className="my-8 relative flex" ref={searchWrapper}>
            {search}
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-0 inset-y-0 flex items-center bg-transparent"
              aria-label="Close Search"
            >
              <X strokeWidth={1} size={24} />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <PageTitle className="flex-grow">{title}</PageTitle>
            <button
              onClick={() => showSearchAndFocus()}
              className="ml-auto sm:hidden"
              aria-label="Open Search"
            >
              <Search strokeWidth={1} size={24} />
            </button>
          </div>
        ))}
      <AntiContainer desktop={false}>
        <div className="mb-6 md:mb-10 flex flex-wrap items-center gap-4 md:gap-6 w-full">
          {search && (
            <Container
              desktop={false}
              className="w-full flex-grow md:w-72 hidden sm:flex"
            >
              {search}
            </Container>
          )}
          {children && (
            <div className="overflow-x-auto ml-auto">
              <Container
                desktop={false}
                className="flex gap-2 w-max items-center"
              >
                <p className="all-caps mr-2">{label}</p>
                {children}
              </Container>
            </div>
          )}
        </div>
      </AntiContainer>
    </>
  )
}
