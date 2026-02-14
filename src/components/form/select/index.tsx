'use client'

import dynamic from 'next/dynamic'
import { ForwardedRef, forwardRef } from 'react'
import { useForm } from '../context'
import { inputClasses } from '../input'
import { SelectControl, SelectProps } from './types'

export * from './types'

const SelectClient = dynamic(
  async () => (await import('./client')).SelectClient,
  {
    ssr: false,
    loading: function SelectLoading() {
      const form = useForm()
      return (
        <div className="flex flex-col gap-2">
          <label className="text-14 opacity-0">Loading</label>
          <input disabled className={inputClasses(form.variant, {})} />
        </div>
      )
    }
  }
)

export const Select = forwardRef(function Select<
  Value extends { [key in ValueKey]: string },
  Multi extends boolean,
  ValueKey extends string
>(
  props: SelectProps<Value, Multi, ValueKey>,
  ref: ForwardedRef<SelectControl>
) {
  // @ts-expect-error Generics make this more difficlut to type
  return <SelectClient {...props} fref={ref} />
})
