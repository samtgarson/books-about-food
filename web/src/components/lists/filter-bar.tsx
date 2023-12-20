'use client'

import { useRouter } from 'next/navigation'
import { FC, ReactNode, useRef, useState } from 'react'
import { Search as SearchIcon } from 'src/components/atoms/icons'
import { mergeParams } from 'src/utils/url-helpers'
import { AntiContainer, Container } from '../atoms/container'
import { PageTitle } from '../atoms/page-title'
import { Search, SearchProps } from './search'

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
            className="animate-fade-in relative flex flex-col justify-center py-8"
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
          <div className="animate-fade-in flex items-center">
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
        <div className="mb-6 flex w-full flex-wrap items-center gap-4 md:mb-10 md:gap-6">
          {search && (
            <Container
              desktop={false}
              className="hidden w-full flex-grow sm:flex md:w-72"
            >
              <Search {...searchProps} onChange={onSearchChange} />
            </Container>
          )}
          {children && (
            <div className="ml-auto overflow-x-auto">
              <Container
                desktop={false}
                className="flex w-max items-center gap-2"
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
