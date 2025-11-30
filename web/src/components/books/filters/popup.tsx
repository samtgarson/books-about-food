'use client'

import { NamedColor } from '@books-about-food/core/services/books/colors'
import { ReactNode, useState } from 'react'
import { FilterSheet } from 'src/components/lists/filter-sheet'
import { Sort } from 'src/components/lists/sort'
import { usePromise } from 'src/hooks/use-promise'
import { toggleItemAuto } from 'src/utils/array-helpers'
import { ColorCircle, colorMap } from './colors'
import { PillList, Tag } from './pill-list'
import { Filters, count } from './util'

export type BookFilterPopupProps = {
  filters?: Filters
  fetchTags: () => Promise<Tag[]>
}
export function BookFilterPopup({
  filters: initialFilters = {},
  fetchTags
}: BookFilterPopupProps) {
  const { loading, value: tags } = usePromise(fetchTags, [])
  const [filters, setFilters] = useState(initialFilters)

  return (
    <FilterSheet
      label="Sort & Filter"
      count={count(filters)}
      params={filters}
      defaultParams={{ _reset: true }}
      loading={loading}
      className="pb-4"
      onClose={() => setFilters(initialFilters)}
    >
      <div className="flex flex-col gap-8 overflow-x-hidden">
        <FilterItem title="Sort by">
          <Sort<NonNullable<Filters['sort']>>
            sorts={{
              releaseDate: 'Release Date',
              createdAt: 'Recently Added'
            }}
            defaultValue="releaseDate"
            value={filters.sort ?? 'releaseDate'}
            onClick={(sort) => setFilters({ ...filters, sort })}
          />
        </FilterItem>
        <FilterItem title="Tags" count={filters.tags?.length}>
          <PillList
            selected={filters.tags ?? []}
            tags={tags}
            initialSelected={initialFilters.tags}
            onClick={(value) => {
              setFilters({
                ...filters,
                tags: toggleItemAuto(filters.tags ?? [], value)
              })
            }}
          />
        </FilterItem>
        <FilterItem title="Colour" count={filters.color ? 1 : 0}>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(colorMap) as NamedColor[]).map((color) => (
              <ColorCircle
                color={color}
                key={color}
                selected={filters.color === color}
                onClick={() => {
                  setFilters({
                    ...filters,
                    color,
                    sort: filters.sort === 'color' ? undefined : filters.sort
                  })
                }}
              />
            ))}
            <ColorCircle
              color="rainbow"
              key="all"
              selected={filters.sort === 'color'}
              onClick={() => {
                setFilters({ ...filters, color: undefined, sort: 'color' })
              }}
            />
          </div>
        </FilterItem>
      </div>
    </FilterSheet>
  )
}

function FilterItem({
  children,
  title,
  count
}: {
  children: ReactNode
  title: string
  count?: number
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <p className="flex gap-4 all-caps">
        {title}
        {Number(count) > 0 && (
          <span className="opacity-40">{count} selected</span>
        )}
      </p>
      {children}
    </div>
  )
}
