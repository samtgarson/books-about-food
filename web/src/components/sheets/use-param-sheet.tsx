'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSheet } from './global-sheet'
import { SheetMap } from './types'

export function useParamSheet<K extends keyof SheetMap, P extends SheetMap[K]>(
  key: K,
  props: P | null
) {
  const { openSheet } = useSheet()
  const router = useRouter()

  useEffect(() => {
    if (props === null) return

    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('action') === key) {
      openSheet(key, props)
      router.replace(location.pathname)
    }
  }, [key, props, openSheet, router])
}
