'use client'

import { useRowLabel } from '@payloadcms/ui'
import type { Data } from 'payload'
import { getValueAtKeyPath } from './utils'

function ArrayFieldTitle({
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

export default ArrayFieldTitle
