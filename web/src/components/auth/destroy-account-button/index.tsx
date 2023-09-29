'use client'

import { X } from 'react-feather'
import { action } from './action'

export function DestroyAccountButton({
  provider,
  className
}: {
  provider: string
  className?: string
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        action(provider)
      }}
    >
      <X strokeWidth={1} />
    </button>
  )
}
