'use client'

import { ReactNode, useCallback, useMemo, useRef } from 'react'
import ReactSelect from 'react-select/async-creatable'
import SuperJSON from 'superjson'
import { MultiValue, OnChangeValue } from 'react-select'
import * as Form from '@radix-ui/react-form'
import { Label } from '../label'
import { Messages } from '../messages'
import { Stringified } from 'src/utils/superjson'
import { selectProps } from './default-props'

export interface SelectProps<
  Value extends { [key in ValueKey]: string } & { __new?: true },
  Multi extends boolean,
  ValueKey extends string
> extends Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'defaultValue' | 'multiple' | 'value'
> {
  name: string
  label: string
  options?: Value[]
  loadOptions?: (query: string) => Promise<Stringified<Value[]>>
  render: keyof Value | ((value: Value) => ReactNode)
  valueKey: ValueKey
  multi?: Multi
  defaultValue?: OnChangeValue<Value, Multi>
  allowCreate?: boolean
}

const isMultiValue = <Value,>(
  value?: OnChangeValue<Value, boolean>
): value is MultiValue<Value> => {
  return Array.isArray(value)
}

export const Select = function Select<
  Value extends { [key in ValueKey]: string } & { __new?: true },
  Multi extends boolean,
  ValueKey extends string
>({
  render,
  name,
  label,
  loadOptions,
  options,
  defaultValue,
  valueKey,
  multi,
  allowCreate,
  ...props
}: SelectProps<Value, Multi, ValueKey>) {
  const input = useRef<HTMLInputElement>(null)
  const renderOption =
    typeof render === 'function' ? render : (value: Value) => value[render]

  const loadOptionsFn = useMemo(
    () =>
      loadOptions
        ? async (search: string) => {
          const data = await loadOptions(search)
          return SuperJSON.parse<Value[]>(data)
        }
        : undefined,
    [loadOptions]
  )

  const stringifyValue = useCallback(
    (value?: OnChangeValue<Value, Multi>) =>
      isMultiValue(value)
        ? value.map((v) => v[valueKey]).join(',')
        : value?.[valueKey],
    [valueKey]
  )

  const onChange = useCallback(
    (val: OnChangeValue<Value, Multi>) => {
      if (!input.current) return
      input.current.value = stringifyValue(val) ?? ''
      input.current.dispatchEvent(new Event('change', { bubbles: true }))
    },
    [stringifyValue]
  )

  return (
    <Form.Field name={name} className="flex flex-col gap-2">
      <Label required={props.required}>{label}</Label>
      <Form.Control asChild>
        <input
          tabIndex={-1}
          type="text"
          ref={input}
          {...props}
          name={name}
          className="h-0"
          defaultValue={stringifyValue(defaultValue)}
        />
      </Form.Control>
      <Form.ValidityState>
        {(validity) => (
          <ReactSelect<Value, Multi, never>
            {...selectProps({ allowCreate, valueKey })}
            required={props.required}
            getOptionValue={(value) => value[valueKey]}
            options={options}
            loadOptions={loadOptionsFn}
            formatOptionLabel={renderOption}
            aria-invalid={!validity?.valid}
            onChange={onChange}
            defaultValue={defaultValue}
            defaultOptions
            isMulti={multi}
          />
        )}
      </Form.ValidityState>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
