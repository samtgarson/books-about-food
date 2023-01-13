'use client'

import * as Select from '@radix-ui/react-select'
import { FC } from 'react'

export type FilterSelectProps = {
  options: { label: string; value: string }[]
  value?: string
  placeholder: string
  onChange?: (value: string) => void
  onPreload?: (value: string) => void
}

export const FilterSelect: FC<FilterSelectProps> = ({
  options,
  value = '',
  placeholder,
  onChange,
  onPreload
}) => {
  return (
    <>
      <Select.Root value={value} onValueChange={onChange}>
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
              {options.map(({ value, label }) => (
                <Select.Item
                  asChild
                  value={value}
                  key={value}
                  onMouseOver={() => onPreload?.(value)}
                >
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
