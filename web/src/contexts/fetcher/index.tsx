'use client'

import { signOut } from 'next-auth/react'
import { useCurrentUser } from 'src/hooks/use-current-user'
import {
  DestroyKey,
  DestroyMap,
  FetchKey,
  FetchMap,
  FunctionArgs,
  FunctionReturn,
  MutateKey,
  MutateMap
} from 'src/services/map'
import 'src/utils/superjson'
import useSWR, { SWRConfiguration } from 'swr'
import { RequestException } from './exceptions'
import { requester } from './requester'

export { prefetch } from './prefetch'

const defaultConfig = { keepPreviousData: true } satisfies SWRConfiguration
export const useFetcher = <K extends FetchKey>(
  key: K | null,
  args: FunctionArgs<FetchMap, K> = {},
  {
    authorized,
    ...config
  }: { immutable?: boolean; authorized?: boolean } & SWRConfiguration = {}
) => {
  const currentUser = useCurrentUser()
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
    requester,
    {
      ...defaultConfig,
      ...config,
      onError
    }
  )

  const mutate = async (
    payload: K extends MutateKey ? FunctionArgs<MutateMap, K> : never
  ) => {
    if (!key) return
    try {
      const res = await requester<MutateMap, MutateKey>(
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

  const destroy = async (
    payload: K extends DestroyKey ? FunctionArgs<DestroyMap, K> : never
  ) => {
    if (!key) return
    try {
      await requester<DestroyMap, DestroyKey>(
        {
          key: key as DestroyKey,
          args: payload as FunctionArgs<DestroyMap, DestroyKey>
        },
        'DELETE'
      )
      return mutateCache(undefined)
    } catch (err) {
      onError(err)
    }
  }

  return { ...swr, mutate, destroy }
}
