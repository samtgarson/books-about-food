'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import cn from 'classnames'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { Check, ChevronDown } from 'src/components/atoms/icons'
import { usePromise } from 'src/hooks/use-promise'
import { Button } from '../atoms/button'
import { Loader } from '../atoms/loader'
import { ParamLink } from '../atoms/param-link'
import { Pill } from '../atoms/pill'
import * as Sheet from '../atoms/sheet'
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

function FilterSelectContent<Value extends string | number = string>({
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
  const { close } = Sheet.useSheetContext()

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

  const label = multi ? (
    <>
      {placeholder}{' '}
      {initialValue && initialValue.length > 0 && (
        <span className="all-caps !leading-none -my-1 rounded-full bg-black px-1.5 py-1 font-bold text-white">
          {initialValue.length}
        </span>
      )}
    </>
  ) : (
    options?.find((o) => o.value === initialValue)?.label || placeholder
  )

  return (
    <>
      <Sheet.Trigger disabled={loading}>
        <Pill className="gap-1.5" disabled={loading}>
          <span className={cn('transition-opacity', loading && 'opacity-50')}>
            {label}
          </span>
          {loading ? (
            <Loader className="-my-2 -mr-1 ml-0.5" />
          ) : (
            <ChevronDown
              size={24}
              strokeWidth={1}
              className="-my-2 -mr-1 ml-0.5"
            />
          )}
        </Pill>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Body
          title={placeholder}
          controls={
            <ParamLink {...{ [param]: null }}>
              <Link
                scroll={false}
                href=""
                className="text-14 bg-transparent"
                onClick={close}
              >
                Reset
              </Link>
            </ParamLink>
          }
        >
          <form>
            {search && (
              <Search
                value={searchValue}
                onChange={setSearchValue}
                className="!text-18 sm:!text-24 mb-4 sm:mb-6"
              />
            )}
            <ul className="flex flex-col gap-2 sm:gap-3">
              {filteredOptions.map((option) => (
                <motion.li
                  key={option.value}
                  className={cn(
                    'sm:text-18 flex items-center justify-between overflow-hidden',
                    matches[option.value] || 'pointer-events-none'
                  )}
                  animate={{ opacity: matches[option.value] ? 1 : 0.1 }}
                  layout
                >
                  <label
                    htmlFor={`filter-${option.value}`}
                    className="flex-grow"
                  >
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
        </Sheet.Body>
        <Sheet.Footer>
          <ParamLink {...{ [param]: value }}>
            <Button
              onClick={close}
              className="w-full"
              variant="dark"
              scroll={false}
            >
              Save
            </Button>
          </ParamLink>
        </Sheet.Footer>
      </Sheet.Content>
    </>
  )
}

export const FilterSelect = <Value extends string | number = string>(
  props: FilterSelectProps<Value>
) => (
  <Sheet.Root>
    <FilterSelectContent {...props} />
  </Sheet.Root>
)
