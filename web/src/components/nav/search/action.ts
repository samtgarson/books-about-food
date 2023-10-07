'use server'

import { quickSearch } from "src/services/search/quick-search"

export async function action(query: string) {
  const { data } = await quickSearch.call({ query })
  return data || []
}
