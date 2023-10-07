'use client'

import { useState, useEffect, useRef, useDeferredValue } from 'react'
import { usePromise } from 'src/hooks/use-promise'
import { action } from './action'
import * as Sheet from 'src/components/atoms/sheet'
import { Search } from 'react-feather'
import { SearchResult } from 'src/models/search-result'
import Image from 'next/image'
import cn from 'classnames'
import { BaseAvatar } from 'src/components/atoms/avatar'

export function QuickSearch({ className }: { className?: string }) {
  const sheet = useRef<Sheet.SheetControl>(null)

  // Toggle the menu when ⌘K is pressed
  // useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (!sheet.current) return
  //
  //     if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault()
  //       sheet.current.setOpen((open) => !open)
  //     }
  //   }
  //
  //   document.addEventListener('keydown', down)
  //   return () => document.removeEventListener('keydown', down)
  // }, [])

  return null
  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Trigger className={className}><Search className="text-white" strokeWidth={1} size={24} /></Sheet.Trigger>
      <Sheet.Content overlay={false} focusTriggerOnClose={false}>
        <QuickSearchContent />
      </Sheet.Content>
    </Sheet.Root>
  )
}

function QuickSearchContent() {
  const [rawQuery, setQuery] = useState('')
  const query = useDeferredValue(rawQuery)
  const { value: results, loading } = usePromise(async () => query.length < 3 ? [] : action(query), [], [query])

  return (
    <Sheet.Body className="sm:px-8 sm:py-6 bg-white/90 backdrop-blur-md flex flex-col !pb-0">
      <div className={cn("flex gap-4 mb-6")}>
        <Search strokeWidth={1} size={32} />
        <input
          autoFocus
          type="text"
          className="text-32 focus:outline-none flex-1 bg-transparent"
          value={rawQuery}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="overflow-y-auto flex flex-col gap-1 pb-6 empty:pb-0">
        {!!rawQuery.length && (<>
          {!loading && !results.length && <div>No Results</div>}
          {results.map((result) => (
            <QuickSearchResult key={result.id} item={new SearchResult(result)} />
          ))}
        </>)}
      </div>
    </Sheet.Body>
  )
}
// backup: string
// size?: AvatarSize
// mobileSize?: AvatarSize
// backgroundColour?: string
// foregroundColour?: string


function QuickSearchResult({ item }: { item: SearchResult }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-white">
      {item.isProfile ? <BaseAvatar size="sm" backup={item.initials} foregroundColour={item.foregroundColour} backgroundColour={item.backgroundColour} imgProps={item.image?.imageAttrs()} /> : null}
      <div className="flex flex-col">
        <p className="text-16 font-medium">{item.name}</p>
        <p className="text-14">{item.description}</p>
      </div>
    </div >
  )
}
