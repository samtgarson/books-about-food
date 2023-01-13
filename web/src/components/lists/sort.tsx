export type SortProps<Value extends string> = {
  sorts: Record<Value, string>
  value?: Value
  onChange?: (value: Value) => void
  onPreload?: (value: Value) => void
}

export const Sort = <Value extends string>({
  sorts,
  value,
  onChange,
  onPreload
}: SortProps<Value>) => {
  const keys = Object.keys(sorts) as Value[]
  return (
    <div className='flex gap-2'>
      <p>Sort by:</p>
      <ul className='flex gap-2'>
        {keys.map((sort) => (
          <li key={sort} className='list-none'>
            {sort === value ? (
              <span className='text-gray-500'>{sorts[sort]}</span>
            ) : (
              <button
                onClick={() => onChange?.(sort)}
                onMouseOver={() => onPreload?.(sort)}
              >
                {sorts[sort]}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
