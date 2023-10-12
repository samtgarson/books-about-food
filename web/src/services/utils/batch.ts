export async function asyncBatch<T, R>(
  items: Array<T>,
  limit: number,
  fn: (item: T) => Promise<R | undefined>
): Promise<R[]> {
  let results: R[] = []
  for (let start = 0; start < items.length; start += limit) {
    const end = start + limit > items.length ? items.length : start + limit

    const slicedResults = await Promise.all(items.slice(start, end).map(fn))

    results = [
      ...results,
      ...(slicedResults.filter((result) => result !== undefined) as R[])
    ]
  }

  return results
}
