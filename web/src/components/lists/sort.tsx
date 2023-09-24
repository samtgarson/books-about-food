import Link from 'next/link'
import { Pill } from 'src/components/atoms/pill'
import { ParamLink } from '../atoms/param-link'

export type SortProps<Value extends string> = {
  sorts: Record<Value, string>
  value?: Value
  defaultValue?: Value
}

export const Sort = <Value extends string>({
  sorts,
  value,
  defaultValue
}: SortProps<Value>) => {
  const keys = Object.keys(sorts) as Value[]
  return (
    <ul className="flex flex-shrink-0 items-center gap-2">
      {keys.map((sort) => {
        const selected = sort === value || (sort === defaultValue && !value)

        return (
          <li key={sort} className="flex-shrink-0 list-none">
            <ParamLink sort={sort === defaultValue ? null : sort}>
              <Link href="" scroll={false}>
                <Pill selected={selected} disabled={selected}>
                  {sorts[sort]}
                </Pill>
              </Link>
            </ParamLink>
          </li>
        )
      })}
    </ul>
  )
}
