'use client'

import { X } from 'src/components/atoms/icons'
import { action } from './actions'

export function DestroyAccountButton({
  provider,
  className,
  onDestroyed
}: {
  provider: string
  className?: string
  onDestroyed?: () => void
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await action(provider)
        onDestroyed?.()
      }}
    >
      <X strokeWidth={1} />
    </button>
  )
}
