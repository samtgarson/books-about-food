'use client'

import * as Form from '@radix-ui/react-form'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { MultiValue, OnChangeValue } from 'react-select'
import ReactSelect, { AsyncCreatableProps } from 'react-select/async-creatable'
import { Stringified, parse } from 'src/utils/superjson'
import { Label } from '../label'
import { Messages } from '../messages'
import { SelectValue, selectProps } from './default-props'

export type { SelectValue }

export interface SelectProps<
  Value extends SelectValue<ValueKey>,
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
  render: keyof Value | ((value: Value & SelectValue<ValueKey>) => ReactNode)
  valueKey: ValueKey
  multi?: Multi
  defaultValue?: OnChangeValue<Value, Multi>
  allowCreate?: boolean
  onChange?: (
    value: OnChangeValue<Value & SelectValue<ValueKey>, Multi>
  ) => void
  onCreate?: (value: string) => void
  showChevron?: boolean
  separator?: string
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
  onChange: externalOnChange,
  onCreate,
  showChevron = false,
  separator = ',',
  ...props
}: SelectProps<Value, Multi, ValueKey>) {
  const input = useRef<HTMLInputElement>(null)
  const renderOption =
    typeof render === 'function' ? render : (value: Value) => value[render]
  const [browserProps, setProps] = useState<
    AsyncCreatableProps<Value, Multi, never>
  >({})

  const loadOptionsFn = useMemo(
    () =>
      loadOptions
        ? async (search: string) => {
            const data = await loadOptions(search)
            return parse(data)
          }
        : undefined,
    [loadOptions]
  )

  const stringifyValue = useCallback(
    (value?: OnChangeValue<Value, Multi>) =>
      isMultiValue(value)
        ? value.map((v) => v[valueKey]).join(separator)
        : value?.[valueKey],
    [valueKey, separator]
  )

  const onChange = useCallback(
    (val: OnChangeValue<Value, Multi>) => {
      if (!input.current) return
      input.current.value = stringifyValue(val) ?? ''
      input.current.dispatchEvent(new Event('change', { bubbles: true }))
      externalOnChange?.(val)
    },
    [stringifyValue, externalOnChange]
  )

  useEffect(() => {
    setProps(
      selectProps({
        valueKey,
        allowCreate,
        unstyled: false,
        showChevron
      })
    )
  }, [valueKey, allowCreate, render, showChevron])

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
            {...browserProps}
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
            onCreateOption={onCreate}
          />
        )}
      </Form.ValidityState>
      <Messages label={label} {...props} />
    </Form.Field>
  )
}
