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
import { signOut } from 'next-auth/react'
import { useCurrentUser } from 'src/hooks/use-current-user'

class RequestException extends Error {
  constructor(public status: number) {
    super('Request failed')
    this.name = 'RequestException'
  }
}

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
  if (!res.ok) throw new RequestException(res.status)
  const json = await res.json()
  return superjson.deserialize<FunctionReturn<Map, K>>(json)
}

const defaultConfig = { keepPreviousData: true } satisfies SWRConfiguration
export const useFetcher = <K extends FetchKey>(
  key: K | null,
  args: FunctionArgs<FetchMap, K> = {},
  {
    immutable,
    authorized,
    ...config
  }: { immutable?: boolean; authorized?: boolean } & SWRConfiguration = {}
) => {
  const currentUser = useCurrentUser()
  const immutableConfig = immutable
    ? {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }
    : {}

  const onError = (err: unknown) => {
    if (err instanceof RequestException) {
      switch (err.status) {
        case 401:
          return signOut()
        default:
          console.error(err)
      }
    }
  }

  const { mutate: mutateCache, ...swr } = useSWR<FunctionReturn<FetchMap, K>>(
    key && (!authorized || currentUser)
      ? { key, args: Object.keys(args).length === 0 ? undefined : args }
      : null,
    fetcher,
    {
      ...defaultConfig,
      ...immutableConfig,
      ...config,
      onError
    }
  )

  const mutate = async (
    payload: K extends MutateKey ? FunctionArgs<MutateMap, K> : never
  ) => {
    if (!key) return
    try {
      const res = fetcher(
        {
          key: key as MutateKey,
          args: payload as FunctionArgs<MutateMap, MutateKey>
        },
        'POST'
      )
      return mutateCache(res as FunctionReturn<FetchMap, K>)
    } catch (err) {
      onError(err)
    }
  }

  return { ...swr, mutate }
}

export const prefetch = async <K extends FetchKey>(
  key: K,
  args: FunctionArgs<FetchMap, K>
) => preload({ key, args }, fetcher)
