'use client'

import type {
  FunctionArgs,
  FunctionKey,
  FunctionReturn
} from 'src/pages/api/data/[fn]'
import useSWR, { SWRConfig, preload, SWRConfiguration } from 'swr'
import superjson from 'superjson'
import 'src/utils/superjson'

export const fetcher = async <K extends FunctionKey>({
  key,
  args
}: {
  key: K
  args: FunctionArgs<K>
}): Promise<FunctionReturn<K>> => {
  const input = superjson.stringify(args)
  const res = await fetch(`/api/data/${key}?input=${encodeURIComponent(input)}`)
  const json = await res.json()
  return superjson.deserialize<FunctionReturn<K>>(json)
}

export const FetchProvider = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={{ keepPreviousData: true }}>{children}</SWRConfig>
}

export const useFetcher = <K extends FunctionKey>(
  key: K,
  args: FunctionArgs<K>,
  { immutable, ...config }: { immutable?: boolean } & SWRConfiguration = {}
) => {
  const immutableConfig = immutable
    ? {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }
    : {}
  return useSWR<FunctionReturn<K>>(
    { key, args: Object.keys(args ?? {}).length === 0 ? undefined : args },
    fetcher,
    { ...immutableConfig, ...config }
  )
}

export const prefetch = async <K extends FunctionKey>(
  key: K,
  args: FunctionArgs<K>
) => preload({ key, args }, fetcher)
