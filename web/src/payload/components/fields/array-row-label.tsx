'use client'

import { useRowLabel } from '@payloadcms/ui'
import type { Data } from 'payload'

function getValueAtKeyPath(data: Data, keyPath: string[]): string | undefined {
  let current: unknown = data
  for (const key of keyPath) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : undefined
}

export default function ArrayRowLabel({
  itemPlaceholder,
  keyPath
}: {
  itemPlaceholder?: string
  keyPath: string[]
}) {
  const { data } = useRowLabel<Data>()
  const title = getValueAtKeyPath(data, keyPath)

  return <>{title || itemPlaceholder}</>
}
