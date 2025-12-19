'use client'

import { NamedColor } from '@books-about-food/core/services/books/colors'
import { ReactNode, useMemo, useState } from 'react'
import { FilterSheet } from 'src/components/lists/filter-sheet'
import { Sort } from 'src/components/lists/sort'
import { usePromise } from 'src/hooks/use-promise'
import { toggleItemAuto } from 'src/utils/array-helpers'
import { fetchTagGroupOptions } from './actions'
import { ColorCircle, colorMap } from './colors'
import { PillList } from './pill-list'
import { Filters, count } from './util'

export type BookFilterPopupProps = {
  filters?: Filters
}
export function BookFilterPopup({
  filters: initialFilters = {}
}: BookFilterPopupProps) {
  const { loading, value: tagGroups } = usePromise(fetchTagGroupOptions, [])
  const [filters, setFilters] = useState(initialFilters)

  const tagGroupsWithSelectedCount = useMemo(() => {
    return tagGroups.map((group) => {
      const groupTagSlugs = group.tags.map((t) => t.value)
      const selectedInGroup = (filters.tags ?? []).filter((slug) =>
        groupTagSlugs.includes(slug)
      )
      return {
        ...group,
        selectedCount: selectedInGroup.length
      }
    })
  }, [filters.tags, tagGroups])

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
        {tagGroupsWithSelectedCount.map((group) => {
          return (
            <FilterItem
              key={group.slug}
              title={group.name}
              count={group.selectedCount}
            >
              <PillList
                selected={filters.tags ?? []}
                tags={group.tags}
                initialSelected={initialFilters.tags}
                onClick={(value) => {
                  setFilters({
                    ...filters,
                    tags: toggleItemAuto(filters.tags ?? [], value)
                  })
                }}
              />
            </FilterItem>
          )
        })}
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
