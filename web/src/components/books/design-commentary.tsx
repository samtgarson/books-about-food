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
        'fixed sm:w-[400px] p-6 rounded-lg bg-primary-lime inset-x-4 sm:right-16 sm:left-auto bottom-4 sm:bottom-16 -rotate-2 hover:rotate-1 flex flex-col gap-1 transition ease-out z-nav',
        display ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="flex justify-between items-center">
        <h3 className="all-caps">{title}</h3>
        <button
          title="Hide this commentary"
          onClick={() => setClosed(true)}
          className="p-2 -m-2"
        >
          <X size={18} strokeWidth={1} />
        </button>
      </div>
      <p className="text-12 sm:text-14 pr-3">{content}</p>
    </div>
  )
}
