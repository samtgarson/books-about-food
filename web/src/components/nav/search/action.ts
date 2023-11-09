'use server'

import { quickSearch } from 'core/services/search/quick-search'
import { call } from 'src/utils/service'

export async function action(query: string) {
  const { data } = await call(quickSearch, { query })
  return data || []
}
