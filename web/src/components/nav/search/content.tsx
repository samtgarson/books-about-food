'use client'

import { SearchResult } from '@books-about-food/core/models/search-result'
import cn from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { Tag } from 'src/components/atoms/icons'
import { Loader } from 'src/components/atoms/loader'
import * as Sheet from 'src/components/atoms/sheet'
import { usePromise } from 'src/hooks/use-promise'
import { useNav } from '../context'
import { action } from './action'
import { QuickSearchAction, SearchAction, quickSearchActions } from './actions'
import { QuickSearchItem } from './item'

export function QuickSearchContent({ onSelect }: { onSelect?: () => void }) {
  const { showTransition } = useNav()
  const [rawQuery, setQuery] = useState('')
  const query = useDeferredValue(rawQuery)
  const { value, loading } = usePromise(
    async () => (query.length < 3 ? [] : action(query)),
    [],
    [query]
  )
  const results = useMemo<Array<SearchResult | SearchAction>>(
    () => [
      ...quickSearchActions(query),
      ...value.map((result) => new SearchResult(result))
    ],
    [value, query]
  )
  const [focused, setFocused] = useState<number>(0)
  const sheetBody = useRef<Sheet.SheetBodyControl>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return
      e.preventDefault()

      if (e.key === 'Enter') {
        if (focused === null) return
        const result = results[focused]
        if (!result) return
        onSelect?.()
        router.push(result.href)
        if (result.href === window.location.pathname) return
        showTransition()
        return
      }

      const currentIndex = focused
      if (currentIndex === null) {
        const nextIndex = e.key === 'ArrowDown' ? 0 : results.length - 1
        setFocused(nextIndex)
        return
      }

      const nextIndex =
        e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1
      const inRangeIndex = Math.max(0, Math.min(results.length - 1, nextIndex))
      setFocused(inRangeIndex)

      if (inRangeIndex === 0) {
        sheetBody.current?.scrollToTop()
      } else {
        document
          .querySelector(`#${results[inRangeIndex].domId}`)
          ?.scrollIntoView({ block: 'nearest' })
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [focused, results, router, onSelect, showTransition])

  return (
    <Sheet.Body
      containerClassName="!p-2 sm:!p-4 bg-opacity-0"
      className="flex flex-col gap-2 sm:gap-4"
      ref={sheetBody}
    >
      <div className={cn('flex gap-4 items-center px-3 py-2 sm:px-4 sm:py-3')}>
        <input
          autoFocus
          type="text"
          className="text-24 sm:text-32 focus:outline-none flex-1 bg-transparent flex-grow placeholder-black/30"
          value={rawQuery}
          onChange={(e) => {
            setQuery(e.target.value)
            setFocused(0)
          }}
          placeholder="Type something..."
        />
        <Loader
          className={cn(
            'transition-opacity',
            loading ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
      <div
        className="overflow-y-auto flex flex-col gap-1 empty:pb-0 group"
        onClick={onSelect}
      >
        {!loading && !results.length && (
          <div className="px-3 sm:px-4">No Results</div>
        )}
        {results.map((result, index) =>
          result instanceof SearchAction ? (
            <QuickSearchAction
              action={result}
              key={result.id}
              focused={focused === index}
              onHover={() => setFocused(index)}
            />
          ) : (
            <QuickSearchResult
              key={result.id}
              item={result}
              focused={focused === index}
              onHover={() => setFocused(index)}
            />
          )
        )}
      </div>
    </Sheet.Body>
  )
}

type QuickSearchResultProps = {
  item: SearchResult
  focused?: boolean
  onHover?: () => void
}

function QuickSearchResult({ item, focused, onHover }: QuickSearchResultProps) {
  return (
    <QuickSearchItem.Root
      href={item.href}
      onHover={onHover}
      id={item.domId}
      focused={focused}
      aria-label={item.name}
    >
      <QuickSearchItem.Image>
        <QuickSearchImage item={item} />
      </QuickSearchItem.Image>
      <div className="flex flex-col">
        <p className="text-14 sm:text-16 font-medium">{item.name}</p>
        <p className="text-12 sm:text-14">{item.description}</p>
      </div>
    </QuickSearchItem.Root>
  )
}

function QuickSearchImage({ item }: { item: SearchResult }) {
  if (item.isProfile) {
    return (
      <BaseAvatar
        size="xs"
        className="!w-5 !h-5 sm:!w-8 sm:!h-8"
        backup={item.initials}
        foregroundColour={item.foregroundColour}
        backgroundColour={item.backgroundColour}
        imgProps={item.image?.imageAttrs()}
      />
    )
  }

  if (item.image) {
    return <Image {...item.image.imageAttrs(50)} />
  }

  switch (item.type) {
    case 'publisher':
      return <div className="h-5 w-5 sm:h-8 sm:w-8 bg-grey" />
    case 'book':
      return <div className="h-[50px] w-[38px] bg-grey" />
    case 'bookTag':
      return <Tag strokeWidth={1} />
    default:
      return null
  }
}
