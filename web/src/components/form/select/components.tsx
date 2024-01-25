import cn from 'classnames'
import { useEffect, useRef } from 'react'
import { ChevronDown, X } from 'src/components/atoms/icons'
import { Loader } from 'src/components/atoms/loader'
import { SelectContext } from './types'

export const NEW_ID = '__new__'

const pillClasses =
  'text-14 rounded-full px-4 py-2 flex items-center gap-2 leading-none'

export function SearchInput<
  Value extends { [key in ValueKey]: string },
  ValueKey extends string
>({
  searchInputRef,
  multi,
  getInputProps,
  selectItem,
  selection,
  createButtonSelected,
  createOption,
  inputValue,
  placeholder
}: SelectContext<Value, ValueKey>) {
  return (
    <input
      {...getInputProps({
        ref: searchInputRef,
        placeholder,
        onKeyDown(e) {
          if (e.key === 'Backspace' && !searchInputRef.current?.value.length) {
            if (multi && selection.length) {
              return selectItem(selection[selection.length - 1])
            }
          }

          if (e.key === 'Enter') {
            if (!createButtonSelected) return

            // @ts-expect-error this isn't typed correctly
            e.preventDownshiftDefault = true
            e.preventDefault()

            return createOption(inputValue)
          }
        }
      })}
      className={cn(
        'bg-transparent flex-grow focus:outline-none',
        multi ? '-my-3 py-3' : 'absolute -inset-4 right-0 p-4'
      )}
    />
  )
}

export function SelectedItems<
  Value extends { [key in ValueKey]: string },
  ValueKey extends string
>({
  multi,
  selectItem,
  selection,
  inputValue,
  valueKey,
  renderOption
}: SelectContext<Value, ValueKey>) {
  if (!multi && inputValue.length) return null
  return (
    <>
      {selection.map((value) => (
        <span
          key={value[valueKey]}
          className={cn('overflow-hidden', multi && [pillClasses, 'bg-grey'])}
        >
          {renderOption(value, { selected: true })}
          {multi && (
            <button
              onClick={(e) => {
                selectItem(value)
                e.stopPropagation()
              }}
              className="-mr-1"
              type="button"
            >
              <X strokeWidth={1} size={16} />
            </button>
          )}
        </span>
      ))}
    </>
  )
}

export function Indicators<
  Value extends { [key in ValueKey]: string },
  ValueKey extends string
>({
  reset,
  selection,
  loading,
  showChevron,
  searchInputRef
}: SelectContext<Value, ValueKey>) {
  return (
    <div className="flex justify-end gap-1 items-center pl-2">
      {loading && <Loader size={22} />}
      {!loading && showChevron && <ChevronDown size={22} strokeWidth={1} />}
      {!loading && selection.length > 0 && (
        <button
          onClick={() => {
            reset()
            searchInputRef.current?.focus()
          }}
          type="button"
          aria-label="Clear selection"
        >
          <X strokeWidth={1} />
        </button>
      )}
    </div>
  )
}

export function Option<
  Value extends { [key in ValueKey]: string },
  ValueKey extends string
>({
  item,
  index,
  selection,
  valueKey,
  getItemProps,
  highlightedIndex,
  renderOption,
  createButtonSelected,
  setItemHeight
}: SelectContext<Value, ValueKey> & {
  item: Value
  index: number
  setItemHeight?: (height?: number) => void
}) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!ref.current || index !== 0) return
    setItemHeight?.(ref.current.getBoundingClientRect().height)

    return () => {
      setItemHeight?.(undefined)
    }
  }, [index, setItemHeight])

  return (
    <li
      {...getItemProps({
        ref,
        item,
        index,
        'aria-selected':
          !createButtonSelected &&
          (selection.includes(item) || highlightedIndex === index)
      })}
      key={item[valueKey]}
      className={cn(
        'px-5 py-2.5 transition-colors flex justify-start aria-selected:bg-grey/50 overflow-hidden'
      )}
    >
      {renderOption(item, { selected: false })}
    </li>
  )
}

export function CreateButton<
  Value extends { [key in ValueKey]: string },
  ValueKey extends string
>({
  inputValue,
  createButtonSelected,
  showCreateButton,
  createOption
}: SelectContext<Value, ValueKey>) {
  if (!showCreateButton(inputValue)) return null
  return (
    <button
      className="px-5 py-4 text-left"
      onClick={async () => {
        await createOption(inputValue)
      }}
      aria-selected={createButtonSelected}
    >
      <span
        className={cn(
          pillClasses,
          '!inline-block cursor-pointer self-start transition-colors',
          createButtonSelected ? 'bg-sand' : 'bg-neutral-light-grey'
        )}
      >
        Add {inputValue}
      </span>
    </button>
  )
}
