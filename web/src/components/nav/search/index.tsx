'use client'

import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  forwardRef,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Search } from 'react-feather'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { Loader } from 'src/components/atoms/loader'
import * as Sheet from 'src/components/atoms/sheet'
import { usePromise } from 'src/hooks/use-promise'
import { SearchResult } from 'src/models/search-result'
import { useNav } from '../context'
import { action } from './action'

export function QuickSearch({ className }: { className?: string }) {
  const { theme } = useNav()
  const sheet = useRef<Sheet.SheetControl>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!sheet.current) return

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        sheet.current.setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Sheet.Root ref={sheet}>
      <Sheet.Trigger className={className}>
        <Search
          className={theme === 'dark' ? 'text-white' : 'text-black'}
          strokeWidth={1}
          size={24}
        />
      </Sheet.Trigger>
      <Sheet.Content
        overlay={false}
        focusTriggerOnClose={false}
        className="self-start mt-[20vh] bg-white/80 backdrop-blur-md max-h-[65vh] max-w-[90vw]"
      >
        <QuickSearchContent onSelect={() => sheet.current?.setOpen(false)} />
      </Sheet.Content>
    </Sheet.Root>
  )
}

function QuickSearchContent({ onSelect }: { onSelect?: () => void }) {
  const [rawQuery, setQuery] = useState('')
  const query = useDeferredValue(rawQuery)
  const { value, loading } = usePromise(
    async () => (query.length < 3 ? [] : action(query)),
    [],
    [query]
  )
  const results = useMemo(
    () => value.map((result) => new SearchResult(result)),
    [value]
  )
  const [focused, setFocused] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return
      e.preventDefault()

      if (e.key === 'Enter') {
        if (focused === null) return
        const result = results[focused]
        onSelect?.()
        router.push(result.href)
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
      document
        .querySelector(`#${results[inRangeIndex].domId}`)
        ?.scrollIntoView({ block: 'nearest' })
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [focused, results, router, onSelect])

  return (
    <Sheet.Body className="sm:px-8 sm:pt-6 !pb-0 flex flex-col bg-opacity-0">
      <div className={cn('flex gap-4 mb-5 sm:mb-6 items-center')}>
        <Search strokeWidth={1} size={32} className="shrink-0" />
        <input
          autoFocus
          type="text"
          className="text-32 focus:outline-none flex-1 bg-transparent flex-grow"
          value={rawQuery}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Loader
          className={cn(
            'transition-opacity',
            loading ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
      <div
        className="overflow-y-auto flex flex-col gap-1 pb-6 empty:pb-0 group"
        onClick={onSelect}
      >
        {!!rawQuery.length && (
          <>
            {!loading && !results.length && <div>No Results</div>}
            {results.map((result, index) => (
              <QuickSearchResult
                key={result.id}
                item={result}
                focused={focused === index}
                onHover={() => setFocused(index)}
              />
            ))}
          </>
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

const QuickSearchResult = forwardRef<HTMLAnchorElement, QuickSearchResultProps>(
  function QuickSearchResult({ item, focused, onHover }, ref) {
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-4 px-5 py-4 bg-white transition-opacity',
          focused ? 'bg-opacity-100' : 'bg-opacity-0'
        )}
        ref={ref}
        onMouseMove={onHover}
        id={item.domId}
      >
        {item.isProfile ? (
          <BaseAvatar
            size="sm"
            backup={item.initials}
            foregroundColour={item.foregroundColour}
            backgroundColour={item.backgroundColour}
            imgProps={item.image?.imageAttrs()}
          />
        ) : item.image ? (
          <Image {...item.image.imageAttrs(50)} />
        ) : (
          <div className="h-[50px] w-[38px] bg-grey" />
        )}
        <div className="flex flex-col">
          <p className="text-16 font-medium">{item.name}</p>
          <p className="text-14">{item.description}</p>
        </div>
      </Link>
    )
  }
)
