'use server'

import {
  DestroyMap,
  FetchMap,
  FunctionArgs,
  FunctionReturn,
  MutateMap,
  destroyMap,
  fetchMap,
  mutateMap
} from './map'

const mapFor = <A extends Action>(action: A) => {
  switch (action) {
    case 'fetch':
      return fetchMap
    case 'mutate':
      return mutateMap
    default:
      return destroyMap
  }
}

type Action = 'fetch' | 'mutate' | 'destroy'
type MapFor<A extends Action> = A extends 'fetch'
  ? FetchMap
  : A extends 'mutate'
  ? MutateMap
  : DestroyMap

export async function callService<
  A extends Action,
  M extends MapFor<A>,
  S extends keyof M
>(
  action: A,
  service: S,
  args: FunctionArgs<M, S>
): Promise<FunctionReturn<M, S>> {
  const map = mapFor(action) as M
  const fn = map[service]
  console.log(fn)

  return fn.call(args)
}
