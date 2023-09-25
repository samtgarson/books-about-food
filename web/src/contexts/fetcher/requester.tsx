'use client'
import type {
  DestroyMap,
  FetchMap,
  FunctionArgs,
  FunctionReturn,
  MutateMap
} from 'src/services/map'
import superjson from 'superjson'
import { RequestException } from './exceptions'

export async function requester<
  Map extends FetchMap | MutateMap | DestroyMap,
  K extends keyof Map
>(
  {
    key,
    args
  }: {
    key: K
    args: FunctionArgs<Map, K>
  },
  method: 'GET' | 'POST' | 'DELETE' = 'GET'
): Promise<FunctionReturn<Map, K>> {
  const input = superjson.stringify(args)
  const res = await fetch(
    `/api/data/${key.toString()}?input=${encodeURIComponent(input)}`,
    { method }
  )
  if (!res.ok) throw new RequestException(res.status)
  const json = res.status !== 204 && (await res.json())
  return superjson.deserialize<FunctionReturn<Map, K>>(json)
}
