'use client'

import cn from 'classnames'
import { useState } from 'react'
import { X } from 'src/components/atoms/icons'
import { useNav } from '../nav/context'

export function DesignCommentary({
  title,
  content
}: {
  title: string
  content: string
}) {
  const { footerVisible } = useNav()
  const [closed, setClosed] = useState(false)

  const display = !footerVisible && !closed

  return (
    <div
      className={cn(
        'fixed inset-x-4 bottom-4 z-nav flex -rotate-2 flex-col gap-1 rounded-lg bg-primary-lime p-6 transition ease-out hover:rotate-1 sm:right-16 sm:bottom-16 sm:left-auto sm:w-[400px]',
        display ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="all-caps">{title}</h3>
        <button
          title="Hide this commentary"
          onClick={() => setClosed(true)}
          className="-m-2 p-2"
        >
          <X size={18} strokeWidth={1} />
        </button>
      </div>
      <p className="pr-3 text-12 sm:text-14">{content}</p>
    </div>
  )
}
