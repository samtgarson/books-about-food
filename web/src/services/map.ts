/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClaim } from 'src/services/claims/create-claim'
import { destroyClaim } from 'src/services/claims/destroy-claim'
import { fetchClaim } from 'src/services/claims/fetch-claim'
import { fetchFavourite } from 'src/services/favourites/fetch-favourite'
import { updateFavourite } from 'src/services/favourites/update-favourite'
import { Service } from 'src/utils/service'
import 'src/utils/superjson'
import { z } from 'zod'

export type Map = {
  [key: string]: Service<any, any>
}

export const fetchMap = {
  favourite: fetchFavourite,
  claim: fetchClaim
} as const satisfies Map

export const mutateMap = {
  favourite: updateFavourite,
  claim: createClaim
} as const satisfies Map

export const destroyMap = {
  claim: destroyClaim
} as const satisfies Map

export type FetchMap = typeof fetchMap
export type MutateMap = typeof mutateMap
export type DestroyMap = typeof destroyMap
export type FetchKey = keyof FetchMap
export type MutateKey = Extract<FetchKey, keyof MutateMap>
export type DestroyKey = Extract<FetchKey, keyof DestroyMap>

export type FunctionArgs<Map, Key extends keyof Map> = z.infer<
  Map[Key] extends Service<infer I, any> ? I : never
>
export type FunctionReturn<
  Map,
  Key extends keyof Map
> = Map[Key] extends Service<any, infer R> ? R : never
