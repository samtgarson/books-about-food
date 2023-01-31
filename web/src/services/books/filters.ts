export const fetchBooksPageFilters = [
  { value: '100', label: '<100 pages', min: 0, max: 100 } as const,
  { value: '101_200', label: '101-200 pages', min: 101, max: 200 } as const,
  { value: '201_300', label: '201-300 pages', min: 201, max: 300 } as const,
  { value: '301_400', label: '301-400 pages', min: 301, max: 400 } as const,
  { value: '401_500', label: '401-500 pages', min: 401, max: 500 } as const,
  { value: '501_600', label: '501-600 pages', min: 501, max: 600 } as const,
  {
    value: '600',
    label: '>600 pages',
    min: 601,
    max: Number.MAX_SAFE_INTEGER
  } as const
]

export type FetchBooksPageFilters =
  typeof fetchBooksPageFilters[number]['value']

export const fetchBooksPageFilterValues = fetchBooksPageFilters.map(
  (f) => f.value
)
