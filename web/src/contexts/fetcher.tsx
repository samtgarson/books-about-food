'use client'

import type {
  FunctionArgs,
  FunctionKey,
  FunctionReturn
} from 'src/pages/api/data/[fn]'
import useSWR, { SWRConfig, preload, unstable_serialize } from 'swr'
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

type FetcherKey<K extends FunctionKey> = { key: K; args: FunctionArgs<K> }
export type FetcherData<K extends FunctionKey> = {
  key: FetcherKey<K>
  data: FunctionReturn<K>
}

export const FetchProvider = ({
  children,
  data
}: {
  children: React.ReactNode
  data: FetcherData<FunctionKey>[]
}) => {
  const fallback = data?.reduce(
    (acc, { key, data }) => ({ ...acc, [unstable_serialize(key)]: data }),
    {}
  )

  return (
    <SWRConfig value={{ fallback, keepPreviousData: true }}>
      {children}
    </SWRConfig>
  )
}

export const useFetcher = <K extends FunctionKey>(
  key: K,
  args: FunctionArgs<K>,
  { immutable }: { immutable?: boolean } = {}
) => {
  return useSWR<FunctionReturn<K>>(
    { key, args: Object.keys(args ?? {}).length === 0 ? undefined : args },
    fetcher,
    immutable
      ? {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
        }
      : undefined
  )
}

export const prefetch = async <K extends FunctionKey>(
  key: K,
  args: FunctionArgs<K>
) => preload({ key, args }, fetcher)
