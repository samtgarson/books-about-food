import { Pill } from 'src/components/atoms/pill'

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
    <div className="flex gap-2 sm:items-center sm:flex-shrink-0 flex-col sm:flex-row">
      <p className="all-caps">Sort by</p>
      <ul className="flex gap-2 flex-col sm:flex-row">
        {keys.map((sort) => (
          <li key={sort} className="list-none flex-shrink-0">
            <Pill
              onClick={() => onChange?.(sort)}
              onMouseOver={() => onPreload?.(sort)}
              selected={sort === value}
              disabled={sort === value}
            >
              {sorts[sort]}
            </Pill>
          </li>
        ))}
      </ul>
    </div>
  )
}
