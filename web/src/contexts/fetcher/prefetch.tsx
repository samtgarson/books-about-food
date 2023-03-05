'use client'
import { FunctionArgs, FetchKey, FetchMap } from 'src/pages/api/data/[fn]'
import { preload } from 'swr'
import { requester } from './requester'

export async function prefetch<K extends FetchKey>(
  key: K,
  args: FunctionArgs<FetchMap, K>
) {
  return preload({ key, args }, requester)
}
