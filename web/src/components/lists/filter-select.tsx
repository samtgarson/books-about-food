'use client'

import * as Select from '@radix-ui/react-select'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { addParam } from 'src/utils/path-helpers'

export type FilterSelectProps = {
  filters: { label: string; value: string }[]
  path: string
  currentFilter?: string
  filterName: string
  placeholder: string
}

export const FilterSelect: FC<FilterSelectProps> = ({
  filters,
  path,
  currentFilter,
  filterName,
  placeholder
}) => {
  const router = useRouter()
  const onChange = (value: string) => {
    router.push(addParam(path, filterName, value))
  }

  return (
    <>
      <Select.Root value={currentFilter ?? ''} onValueChange={onChange}>
        <Select.Trigger>
          <Select.Value />
          <Select.Icon>↓</Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className='bg-white'>
            <Select.ScrollUpButton />
            <Select.Viewport>
              <Select.Item asChild value={''} key={''}>
                <Select.ItemText>{placeholder}</Select.ItemText>
              </Select.Item>
              {filters.map(({ value, label }) => (
                <Select.Item asChild value={value} key={value}>
                  <Select.ItemText>{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  )
}
