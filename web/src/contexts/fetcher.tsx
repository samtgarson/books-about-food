'use client'

import {
  FunctionArgs,
  FetchKey,
  FunctionReturn,
  MutateKey,
  FetchMap,
  MutateMap
} from 'src/pages/api/data/[fn]'
import useSWR, { preload, SWRConfiguration } from 'swr'
import superjson from 'superjson'
import 'src/utils/superjson'

export const fetcher = async <
  Map extends FetchMap | MutateMap,
  K extends keyof Map
>(
  {
    key,
    args
  }: {
    key: K
    args: FunctionArgs<Map, K>
  },
  method: 'GET' | 'POST' = 'GET'
): Promise<FunctionReturn<Map, K>> => {
  const input = superjson.stringify(args)
  const res = await fetch(
    `/api/data/${key.toString()}?input=${encodeURIComponent(input)}`,
    { method }
  )
  const json = await res.json()
  return superjson.deserialize<FunctionReturn<Map, K>>(json)
}

const defaultConfig = { keepPreviousData: true } satisfies SWRConfiguration
export const useFetcher = <K extends FetchKey>(
  key: K | null,
  args: FunctionArgs<FetchMap, K> = undefined,
  { immutable, ...config }: { immutable?: boolean } & SWRConfiguration = {}
) => {
  const immutableConfig = immutable
    ? {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }
    : {}
  const { mutate: mutateCache, ...swr } = useSWR<FunctionReturn<FetchMap, K>>(
    key
      ? { key, args: Object.keys(args ?? {}).length === 0 ? undefined : args }
      : null,
    fetcher,
    { ...defaultConfig, ...immutableConfig, ...config }
  )

  const mutate = async (
    args: FunctionArgs<MutateMap, K extends MutateKey ? K : never>
  ) => {
    if (!key) return
    const res = fetcher({ key: key as MutateKey, args }, 'POST')
    return mutateCache(res as FunctionReturn<FetchMap, K>)
  }

  return { ...swr, mutate }
}

export const prefetch = async <K extends FetchKey>(
  key: K,
  args: FunctionArgs<FetchMap, K>
) => preload({ key, args }, fetcher)
