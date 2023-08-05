'use client'

import { FC, ReactNode, useRef, useState } from 'react'
import { Search as SearchIcon } from 'react-feather'
import { AntiContainer, Container } from '../atoms/container'
import { PageTitle } from '../atoms/page-title'
import { Search, SearchProps } from './search'
import { useRouter } from 'next/navigation'
import { mergeParams } from 'src/utils/url-helpers'

export type FilterBarProps = {
  children?: ReactNode
  search?: Omit<SearchProps, 'className'>
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
  const searchProps = { ...search, className: 'w-full' }
  const router = useRouter()

  const showSearchAndFocus = () => {
    setShowSearch(true)
  }

  const onSearchChange = (value: string) => {
    const search = !value?.length ? null : value
    const href = mergeParams({ search })
    router.replace(href)
  }

  return (
    <>
      {title &&
        search &&
        (showSearch ? (
          <div
            className="py-8 relative flex flex-col justify-center animate-fade-in"
            ref={searchWrapper}
          >
            <Search
              {...searchProps}
              autoFocus
              onReset={() => setShowSearch(false)}
              onBlur={() => {
                !searchProps.value?.length && setShowSearch(false)
              }}
              onChange={onSearchChange}
            />
          </div>
        ) : (
          <div className="flex items-center animate-fade-in">
            <PageTitle className="flex-grow">{title}</PageTitle>
            <button
              onClick={() => showSearchAndFocus()}
              className="ml-auto sm:hidden"
              aria-label="Open Search"
            >
              <SearchIcon strokeWidth={1} size={24} />
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
              <Search {...searchProps} onChange={onSearchChange} />
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
