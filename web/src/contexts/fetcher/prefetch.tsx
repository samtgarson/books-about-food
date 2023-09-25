'use client'
import type { FetchKey, FetchMap, FunctionArgs } from 'src/services/map'
import { preload } from 'swr'
import { requester } from './requester'

export async function prefetch<K extends FetchKey>(
  key: K,
  args: FunctionArgs<FetchMap, K>
) {
  return preload({ key, args }, requester)
}
