'use client'

import * as Checkbox from '@radix-ui/react-checkbox'
import { motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { Check, ChevronDown } from 'react-feather'
import { Button } from '../atoms/button'
import { Pill } from '../atoms/pill'
import * as Sheet from '../atoms/sheet'
import { Search } from './search'
import cn from 'classnames'

type BaseFilterSelectProps<Value> = {
  options: { label: string; value: Value }[]
  placeholder: string
  search?: boolean
}

type SingleFilterSelectProps<Value> = {
  multi: false
  value?: Value
  onChange?: (value: Value | undefined) => void
  onPreload?: (value: Value | undefined) => void
}

type MultiFilterSelectProps<Value> = {
  multi: true
  value?: Value[]
  onChange?: (value: Value[]) => void
  onPreload?: (value: Value[]) => void
}

export type FilterSelectProps<Value> = BaseFilterSelectProps<Value> &
  (SingleFilterSelectProps<Value> | MultiFilterSelectProps<Value>)

const FilterSelectContent = <Value extends string | number = string>({
  onChange,
  multi,
  options,
  value: initialValue,
  placeholder,
  onPreload,
  search
}: FilterSelectProps<Value>) => {
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
        return a.label.localeCompare(b.label)
      }),
    [options, matches]
  )

  const onCheckedChange = useCallback(
    (id: Value, checked: boolean) => {
      if (multi && (Array.isArray(value) || typeof value === 'undefined')) {
        const set = new Set(value ?? [])
        const newValue = checked ? set.add(id) : set.delete(id) && set
        if (!newValue) return
        setValue(Array.from(newValue))
        onPreload?.(Array.from(newValue))
      } else if (!multi && !Array.isArray(value)) {
        const newValue = checked ? value : undefined
        setValue(newValue)
        onPreload?.(newValue)
      }
    },
    [multi, onPreload, value]
  )

  const label = multi ? (
    <>
      {placeholder}{' '}
      {initialValue && initialValue.length > 0 && (
        <span className="all-caps font-bold text-white bg-black rounded-full px-1.5 py-1 -my-1 leading-0">
          {initialValue.length}
        </span>
      )}
    </>
  ) : (
    initialValue || placeholder
  )

  return (
    <>
      <Sheet.Trigger asChild>
        <Pill className="gap-1.5">
          {label}
          <ChevronDown
            size={24}
            strokeWidth={1}
            className="-my-2 ml-0.5 -mr-1"
          />
        </Pill>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Body>
          <Sheet.Header title={placeholder}>
            <button
              className="bg-transparent opacity-50 text-14"
              onClick={() => {
                if (multi) {
                  const newValue: Value[] = []
                  setValue(newValue)
                  onChange?.(newValue)
                } else {
                  const newValue = undefined
                  setValue(newValue)
                  onChange?.(newValue)
                }
                close()
              }}
            >
              Reset
            </button>
          </Sheet.Header>
          <form>
            {search && (
              <div className="flex">
                <Search
                  debounce={0}
                  value={searchValue}
                  onChange={setSearchValue}
                  className="text-20 sm:text-24 mb-4 sm:mb-6"
                />
              </div>
            )}
            <ul className="flex flex-col gap-2 sm:gap-3">
              {filteredOptions.map((option) => (
                <motion.li
                  key={option.value}
                  className={cn(
                    'flex justify-between items-center sm:text-18 overflow-hidden',
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
                    className="w-6 h-6 border border-black rounded-sm data-[state=checked]:bg-black text-white flex items-center justify-center transition-all ease-out"
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
          <Button
            onClick={() => {
              multi ? onChange?.(value as Value[]) : onChange?.(value as Value)
              close()
            }}
            className="w-full border-t border-black pt-4 pb-6 sm:pt-6"
          >
            Save
          </Button>
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
