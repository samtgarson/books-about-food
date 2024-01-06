'use client'

import * as Form from '@radix-ui/react-form'
import * as Popover from '@radix-ui/react-popover'
import cn from 'classnames'
import { useCombobox } from 'downshift'
import { useCallback, useEffect, useRef, useState } from 'react'
import { parse } from 'src/utils/superjson'
import { useForm } from '../context'
import { inputClasses } from '../input'
import { Label } from '../label'
import { Messages } from '../messages'
import {
  CreateButton,
  Indicators,
  NEW_ID,
  Option,
  SearchInput,
  SelectedItems
} from './components'
import { SelectContext, SelectProps, SelectValue } from './types'

const isMultiValue = <Value,>(value?: Value | Value[]): value is Value[] => {
  return Array.isArray(value)
}

export const Select = function Select<
  Value extends { [key in ValueKey]: string },
  Multi extends boolean,
  ValueKey extends string
>({
  render,
  name,
  label,
  options,
  loadOptions,
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
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { variant } = useForm()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Value[]>(options || [])
  const [createButtonSelected, setCreateButtonSelected] = useState(false)
  const [selection, setSelection] = useState<Value[]>(
    isMultiValue(defaultValue) ? defaultValue : []
  )
  const renderOption =
    typeof render === 'function' ? render : (value: Value) => value[render]

  const container =
    typeof document !== 'undefined'
      ? (document.querySelector('[data-sheet-portal]') as HTMLElement | null) ||
        document.body
      : undefined
  const showCreateButton = (val: string) => !!allowCreate && val.length > 0

  const loadItems = useCallback(
    async (search?: string) => {
      if (!loadOptions) return []
      setLoading(true)
      const data = await loadOptions(search ?? '')
      setLoading(false)
      const newItems = parse(data)
      setItems(newItems)
      return newItems
    },
    [loadOptions]
  )

  function onChangeSingle(value: Value) {
    searchInputRef.current?.blur()
    return [value]
  }

  function onChangeMulti(value: Value) {
    const index = selection.indexOf(value)
    if (index >= 0) {
      return [...selection.slice(0, index), ...selection.slice(index + 1)]
    } else {
      return [...selection, value]
    }
  }

  const comboBox = useCombobox({
    selectedItem: null,
    defaultHighlightedIndex: 0,
    items,
    itemToString(item) {
      return item ? item[valueKey] : ''
    },
    async onSelectedItemChange({ selectedItem, inputValue }) {
      if (!selectedItem) {
        return setSelection([])
      }

      if (selectedItem[valueKey] === NEW_ID) {
        if (!inputValue) return
        if (!onCreate) selectedItem = { [valueKey]: inputValue } as Value
        else {
          const newValue = await onCreate(inputValue)
          if (!newValue) return
          selectedItem = newValue
        }
      }

      const newValue = multi
        ? onChangeMulti(selectedItem)
        : onChangeSingle(selectedItem)
      setSelection(newValue)
      if (multi) externalOnChange?.(newValue as SelectValue<Value, Multi>)
      else externalOnChange?.(newValue[0] as SelectValue<Value, Multi>)
    },
    async onInputValueChange({ inputValue }) {
      let newItems: Value[] = []
      if (options) {
        if (!inputValue) return setItems(options)
        newItems = options.filter((item) => item[valueKey].includes(inputValue))
        setItems(newItems)
      } else {
        newItems = await loadItems(inputValue)
      }

      if (
        newItems.length === 0 &&
        !!inputValue?.length &&
        showCreateButton(inputValue)
      ) {
        setCreateButtonSelected(true)
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.FunctionReset:
          setSelection([])
          return changes
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.FunctionSelectItem:
          return {
            ...changes,
            isOpen: changes.isOpen || multi,
            highlightedIndex: state.highlightedIndex,
            inputValue: ''
          }
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: ''
          }
        case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
          if (!items.length) return changes
          if (createButtonSelected) {
            setCreateButtonSelected(false)
            return { ...changes, highlightedIndex: 0 }
          }

          if (
            state.highlightedIndex === items.length - 1 &&
            showCreateButton(state.inputValue)
          ) {
            setCreateButtonSelected(true)
            return { ...changes, highlightedIndex: state.highlightedIndex }
          }

          return changes
        case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
          if (!items.length) return changes
          if (createButtonSelected) {
            setCreateButtonSelected(false)
            return { ...changes, highlightedIndex: items.length - 1 }
          }

          if (
            state.highlightedIndex === 0 &&
            showCreateButton(state.inputValue)
          ) {
            setCreateButtonSelected(true)
            return { ...changes, highlightedIndex: state.highlightedIndex }
          }

          return {
            ...changes,
            highlightedIndex:
              (state.highlightedIndex - 1 + items.length) % items.length
          }
        default:
          return changes
      }
    }
  })

  const { isOpen, getMenuProps, getLabelProps, selectItem } = comboBox

  async function createOption(val: string) {
    const newValue = onCreate
      ? await onCreate(val)
      : ({ [valueKey]: val } as Value)
    if (!newValue) return
    setItems((items) => [...items, newValue])
    selectItem(newValue)
  }

  useEffect(() => {
    loadItems()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const context: SelectContext<Value, ValueKey> = {
    ...comboBox,
    multi,
    createOption,
    createButtonSelected,
    searchInputRef,
    valueKey,
    selection,
    renderOption,
    loading,
    showChevron,
    showCreateButton
  }

  return (
    <Form.Field
      name={name}
      className="flex flex-col gap-2"
      onFocus={(e) => {
        if (e.target === searchInputRef.current) return
        if (e.target.tagName === 'BUTTON') return
        searchInputRef.current?.click()
      }}
    >
      <Label required={props.required} {...getLabelProps()}>
        {label}
      </Label>
      <Form.Control asChild>
        <input
          tabIndex={-1}
          type="text"
          {...props}
          ref={input}
          value={selection.map((v) => v[valueKey]).join(separator)}
          name={name}
          className="h-0 absolute"
        />
      </Form.Control>
      <Popover.Root
        open={isOpen && (!loading || items.length > 0 || allowCreate)}
      >
        <Popover.Anchor
          className={cn(
            inputClasses(variant, props),
            'flex min-h-14',
            multi && 'py-3'
          )}
        >
          <div className="flex flex-wrap gap-2 flex-1 relative overflow-hidden">
            <SelectedItems {...context} />
            <SearchInput {...context} />
          </div>
          <Indicators {...context} />
        </Popover.Anchor>
        <Popover.Portal container={container} forceMount>
          <Popover.Content
            className={cn(
              'z-interactive-ui w-[var(--radix-popover-trigger-width)] bg-white max-h-[min(300px,var(--radix-popover-content-available-height))] book-shadow flex flex-col',
              'h-0 opacity-0 data-[state=open]:transition-all duration-100 pointer-events-none data-[state=open]:pointer-events-auto data-[state=open]:h-fit data-[state=open]:opacity-100'
            )}
            {...getMenuProps()}
            onOpenAutoFocus={(e) => e.preventDefault()}
            sideOffset={4}
          >
            <ul
              className={cn(
                'overflow-y-auto',
                loading && 'opacity-50 pointer-events-none'
              )}
            >
              {items.map((item, index) => (
                <Option
                  item={item}
                  index={index}
                  key={item[valueKey]}
                  {...context}
                />
              ))}
            </ul>
            <CreateButton {...context} />
            {loading && items.length === 0 && (
              <div className="p-4 text-center text-black/50">Loading...</div>
            )}
            {!loading && items.length === 0 && !allowCreate && (
              <div className="p-5 text-black/50">No results</div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Messages label={label} name={name} {...props} />
    </Form.Field>
  )
}
