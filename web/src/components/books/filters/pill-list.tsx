'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Pill } from 'src/components/atoms/pill'
import { Search } from 'src/components/lists/search'

export type Tag = { label: string; value: string }
type PillListProps = {
  tags: Tag[]
  onClick: (tag: string) => void
  limit?: number
  selected: string[]
  initialSelected?: string[]
  search?: boolean
}

export function PillList({
  tags,
  onClick,
  limit = 20,
  selected,
  initialSelected = [],
  search = true
}: PillListProps) {
  const [searchValue, setSearchValue] = useState('')
  const [showAll, setShowAll] = useState(false)
  const filteredTags = useMemo(
    () =>
      tags
        .filter((tag) =>
          tag.label.toLowerCase().includes(searchValue.toLowerCase())
        )
        // Make sure initially selected tags are always visible, then sort alphabetically
        .sort((a, b) => {
          if (
            initialSelected.includes(a.value) &&
            !initialSelected.includes(b.value)
          )
            return -1
          if (
            !initialSelected.includes(a.value) &&
            initialSelected.includes(b.value)
          )
            return 1
          return a.label.localeCompare(b.label)
        }),
    [tags, searchValue, initialSelected]
  )

  const visibleTags = showAll ? filteredTags : filteredTags.slice(0, limit)

  return (
    <>
      {search && (
        <Search
          value={searchValue}
          onChange={setSearchValue}
          className="-mt-1 w-full text-18!"
          debounceDelay={250}
        />
      )}
      <motion.ul className="flex flex-wrap gap-3" layout layoutScroll>
        <AnimatePresence mode="popLayout">
          {visibleTags.map((tag) => (
            <motion.li
              key={`${searchValue}-${tag.value}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout="position"
              layoutScroll
            >
              <button onClick={() => onClick(tag.value)}>
                <Pill selected={selected.includes(tag.value)}>{tag.label}</Pill>
              </button>
            </motion.li>
          ))}
          {filteredTags.length > limit && !showAll && (
            <motion.li
              key="show-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout="position"
              layoutScroll
            >
              <button onClick={() => setShowAll(true)}>
                <Pill variant="filled">
                  Show {filteredTags.length - limit} more
                </Pill>
              </button>
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>
    </>
  )
}
