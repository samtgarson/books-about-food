'use client'

import { useEffect, useRef } from 'react'
import { Search } from 'src/components/atoms/icons'
import * as Sheet from 'src/components/atoms/sheet'
import { useNav } from '../context'
import { QuickSearchContent } from './content'

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
      <Sheet.Trigger className={className} aria-label="Search">
        <Search
          className={theme === 'dark' ? 'text-white' : 'text-black'}
          strokeWidth={1}
          size={24}
        />
      </Sheet.Trigger>
      <Sheet.Content
        showCloseButton={false}
        overlay={false}
        focusTriggerOnClose={false}
        className="self-start mt-[20vh] bg-white/70 backdrop-blur-md !max-h-[50vh] max-w-[90vw] rounded-lg !pb-0"
      >
        <QuickSearchContent onSelect={() => sheet.current?.setOpen(false)} />
      </Sheet.Content>
    </Sheet.Root>
  )
}
