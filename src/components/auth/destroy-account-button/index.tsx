'use client'

import { X } from 'src/components/atoms/icons'
import { action } from './actions'

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
