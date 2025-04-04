'use client'

import cn from 'classnames'
import { motion } from 'framer-motion'
import { Checkbox } from 'radix-ui'
import { useCallback, useMemo, useState } from 'react'
import { Check } from 'src/components/atoms/icons'
import { usePromise } from 'src/hooks/use-promise'
import { FilterSheet } from './filter-sheet'
import { Search } from './search'

type BaseFilterSelectProps<Value> = {
  options:
    | { label: string; value: Value }[]
    | (() => Promise<{ label: string; value: Value }[]>)
  placeholder: string
  search?: boolean
  param: string
}

type SingleFilterSelectProps<Value> = {
  multi: false
  value?: Value
}

type MultiFilterSelectProps<Value> = {
  multi: true
  value?: Value[]
}

export type FilterSelectProps<Value> = BaseFilterSelectProps<Value> &
  (SingleFilterSelectProps<Value> | MultiFilterSelectProps<Value>)

export function FilterSelect<Value extends string | number = string>({
  multi,
  options: optionsProvider,
  value: initialValue,
  placeholder,
  search,
  param
}: FilterSelectProps<Value>) {
  const { loading, value: options } = usePromise(
    optionsProvider instanceof Function
      ? optionsProvider
      : async () => optionsProvider,
    []
  )
  const [value, setValue] = useState(initialValue)
  const [searchValue, setSearchValue] = useState('')

  const matches = useMemo(
    () =>
      options.reduce(
        (hsh, option) => ({
          ...hsh,
          [option.value]: option.label
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        }),
        {} as Record<Value, boolean>
      ),
    [searchValue, options]
  )

  const filteredOptions = useMemo(
    () =>
      options.sort((a, b) => {
        const foundA = matches[a.value]
        const foundB = matches[b.value]

        if (foundA && !foundB) return -1
        if (!foundA && foundB) return 1
        return search ? a.label.localeCompare(b.label) : 0
      }),
    [options, matches, search]
  )

  const onCheckedChange = useCallback(
    (id: Value, checked: boolean) => {
      if (multi && (Array.isArray(value) || typeof value === 'undefined')) {
        const set = new Set(value ?? [])
        const newValue = checked ? set.add(id) : set.delete(id) && set
        if (!newValue) return
        setValue(Array.from(newValue))
      } else if (!multi && !Array.isArray(value)) {
        const newValue = checked ? id : undefined
        setValue(newValue)
      }
    },
    [multi, value]
  )

  const label = multi
    ? placeholder
    : options?.find((o) => o.value === initialValue)?.label || placeholder

  return (
    <FilterSheet
      label={label}
      loading={loading}
      count={multi ? initialValue?.length : undefined}
      defaultParams={{ [param]: null }}
      params={{ [param]: value }}
    >
      <form>
        {search && (
          <Search
            value={searchValue}
            onChange={setSearchValue}
            className="mb-4 !text-18 sm:mb-6 sm:!text-24"
          />
        )}
        <ul className="flex flex-col gap-2 sm:gap-3">
          {filteredOptions.map((option) => (
            <motion.li
              key={option.value}
              className={cn(
                'flex items-center justify-between overflow-hidden sm:text-18',
                matches[option.value] || 'pointer-events-none'
              )}
              animate={{ opacity: matches[option.value] ? 1 : 0.1 }}
              layout
            >
              <label htmlFor={`filter-${option.value}`} className="flex-grow">
                {option.label}
              </label>
              <Checkbox.Root
                value={option.value}
                onCheckedChange={(checked) =>
                  onCheckedChange(option.value, !!checked)
                }
                checked={
                  Array.isArray(value)
                    ? value.includes(option.value)
                    : value === option.value
                }
                id={`filter-${option.value}`}
                name={`${option.value}`}
                className="flex h-6 w-6 items-center justify-center rounded-sm border border-black text-white transition-all ease-out data-[state=checked]:bg-black"
              >
                <Checkbox.Indicator asChild>
                  <Check size={16} strokeWidth={1.5} />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </motion.li>
          ))}
        </ul>
      </form>
    </FilterSheet>
  )
}
