import Link from 'next/link'
import { ReactNode } from 'react'
import { Pill } from 'src/components/atoms/pill'
import { ParamLink } from '../atoms/param-link'

export type SortProps<Value extends string> = {
  sorts: { [key in Value]?: string }
  value?: Value
  defaultValue?: Value
  onClick?: undefined | ((value: Value | undefined) => void)
}

function ItemWrapper({
  children,
  onClick
}: {
  children: ReactNode
  onClick?: () => void
}) {
  if (onClick) return <button onClick={onClick}>{children}</button>

  return (
    <Link href="" scroll={false}>
      {children}
    </Link>
  )
}

export const Sort = <Value extends string>({
  sorts,
  value,
  defaultValue,
  onClick
}: SortProps<Value>) => {
  const keys = Object.keys(sorts) as Value[]
  return (
    <ul className="flex flex-shrink-0 items-center gap-2">
      {keys.map((sort) => {
        const selected = sort === value || (sort === defaultValue && !value)

        return (
          <li key={sort} className="flex-shrink-0 list-none">
            <ParamLink sort={sort === defaultValue ? null : sort}>
              <ItemWrapper
                onClick={
                  onClick
                    ? () => onClick(sort === defaultValue ? undefined : sort)
                    : undefined
                }
              >
                <Pill selected={selected} disabled={selected}>
                  {sorts[sort]}
                </Pill>
              </ItemWrapper>
            </ParamLink>
          </li>
        )
      })}
    </ul>
  )
}
