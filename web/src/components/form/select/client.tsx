'use client'

import { wrapArray } from '@books-about-food/shared/utils/array'
import cn from 'classnames'
import { useCombobox } from 'downshift'
import { Form, Popover } from 'radix-ui'
import {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { useVisualBoundary } from 'src/components/utils/visual-boundary'
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
import { SelectContext, SelectControl, SelectProps, SelectValue } from './types'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null
}

export const SelectClient = function Select<
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
  placeholder,
  fref: ref,
  hideDropdownWhenEmpty = true,
  ...props
}: SelectProps<Value, Multi, ValueKey> & {
  fref?: ForwardedRef<SelectControl>
}) {
  const { ref: boundaryRef } = useVisualBoundary()
  const input = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { variant } = useForm()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Value[]>(options || [])
  const [createButtonSelected, setCreateButtonSelected] = useState(false)
  const [itemHeight, setItemHeight] = useState<number | undefined>(undefined)
  const [selection, setSelection] = useState<Value[]>(
    defaultValue ? wrapArray(defaultValue) : []
  )
  const renderOption =
    typeof render === 'function' ? render : (value: Value) => value[render]

  const container =
    document.querySelector('[data-sheet-anchor]') || document.body
  const showCreateButton = (val: string) => !!allowCreate && val.length > 0

  useImperativeHandle(ref, () => ({
    async clear() {
      setSelection([])
    }
  }))

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
      setTimeout(() => {
        input.current?.dispatchEvent(new Event('change', { bubbles: true }))
      }, 0)

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
          // @ts-expect-error how to type this
          externalOnChange?.(multi ? [] : undefined)
          return changes
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.FunctionSelectItem:
          return {
            ...changes,
            isOpen: multi && !hideDropdownWhenEmpty,
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
        case useCombobox.stateChangeTypes.InputChange:
          if (!changes.inputValue?.length && hideDropdownWhenEmpty) {
            return { ...changes, isOpen: false }
          }

          return changes
        case useCombobox.stateChangeTypes.InputClick:
          if (!changes.inputValue?.length && hideDropdownWhenEmpty) {
            return { ...changes, isOpen: false }
          }

          return changes
        default:
          return changes
      }
    }
  })

  const {
    isOpen: stateIsOpen,
    getMenuProps,
    getLabelProps,
    selectItem
  } = comboBox
  const isOpen = stateIsOpen && (!loading || items.length > 0 || allowCreate)

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
    placeholder,
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
    <Form.Field name={name} className="flex flex-col gap-2">
      {label && (
        <Label required={props.required} {...getLabelProps()}>
          {label}
        </Label>
      )}
      <Form.Control asChild>
        <input
          tabIndex={-1}
          type="text"
          {...props}
          ref={input}
          value={selection.map((v) => v[valueKey]).join(separator)}
          name={name}
          className="absolute h-0"
        />
      </Form.Control>
      <Popover.Root open={isOpen}>
        <Popover.Anchor
          className={cn(
            inputClasses(variant, props),
            'flex min-h-14 overflow-hidden',
            multi && 'px-3 py-3'
          )}
        >
          <div className="relative flex min-h-6 flex-1 flex-wrap gap-2 overflow-hidden">
            <SelectedItems {...context} />
            <SearchInput {...context} />
          </div>
          <Indicators {...context} />
        </Popover.Anchor>
        <Popover.Portal forceMount container={container as HTMLElement | null}>
          <Popover.Content
            forceMount
            collisionBoundary={boundaryRef}
            className={cn(
              'book-shadow w-(--radix-popover-trigger-width) z-interactive-ui flex flex-col bg-white',
              'data-[state=closed]:pointer-events-none! h-0 opacity-0 duration-100 data-[state=open]:h-fit data-[state=open]:opacity-100 data-[state=open]:transition-all'
            )}
            {...getMenuProps({
              onOpenAutoFocus: (e) => e.preventDefault(),
              sideOffset: 4,
              style: {
                maxHeight:
                  itemHeight &&
                  `min(300px, max(${
                    Math.min(2.5, items.length) * itemHeight
                  }px, calc(var(--radix-popover-content-available-height)) - 8px))`
              }
            })}
          >
            <ul
              className={cn(
                'overflow-y-auto',
                loading && 'pointer-events-none opacity-50'
              )}
            >
              {items.map((item, index) => (
                <Option
                  setItemHeight={setItemHeight}
                  item={item}
                  index={index}
                  key={item[valueKey]}
                  {...context}
                />
              ))}
            </ul>
            <CreateButton {...context} />
            {!loading && items.length === 0 && !allowCreate && (
              <div className="p-5 text-black/50">No results</div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {label && <Messages label={label} name={name} {...props} />}
    </Form.Field>
  )
}
