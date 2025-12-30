'use client'

import { useRowLabel } from '@payloadcms/ui'
import type { Data } from 'payload'

function ArrayFieldTitle({
  itemPlaceholder,
  keyPath
}: {
  itemPlaceholder?: string
  keyPath: string[]
}) {
  const { data } = useRowLabel<Data>()
  console.log(data)
  const title = keyPath.reduce((obj, key) => {
    if (typeof obj === 'string') return obj
    if (obj !== null && typeof obj === 'object' && key in obj)
      return obj[key as keyof typeof obj]
    return null
  }, data as unknown)

  return <>{title || itemPlaceholder}</>
}

export default ArrayFieldTitle
