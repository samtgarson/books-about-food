import cn from 'classnames'
import { MouseEvent } from 'react'
import { ChevronDown, X } from 'react-feather'
import { components } from 'react-select'
import { AsyncCreatableProps } from 'react-select/async-creatable'
import { Loader } from 'src/components/atoms/loader'

const pillClasses =
  'text-14 rounded-full px-4 py-2 flex items-center gap-2 leading-none'

export type SelectValue<ValueKey extends string> =
  | ({ [key in ValueKey]: string } & { __new?: never })
  | ({ [key in ValueKey]: string } & { __new: true })

export const selectProps = <
  Value extends SelectValue<ValueKey>,
  Multi extends boolean,
  ValueKey extends string
>({
  allowCreate,
  valueKey,
  unstyled,
  showChevron = false,
  bordered
}: {
  allowCreate?: boolean
  valueKey: ValueKey
  unstyled?: boolean
  showChevron?: boolean
  bordered?: boolean
}) => {
  const portalTarget = document.querySelector(
    '[role=dialog][data-state=open]'
  ) as HTMLElement | null
  return {
    unstyled: true,
    isClearable: true,
    allowCreateWhileLoading: false,
    menuShouldScrollIntoView: true,
    menuPortalTarget: portalTarget,
    menuPosition: portalTarget ? 'fixed' : 'absolute',
    getNewOptionData(inputValue) {
      return {
        [valueKey]: inputValue,
        __new: true
      } as Value
    },
    classNames: {
      control: (state) =>
        cn(
          'bg-white transition-colors',
          state.isFocused ? 'bg-opacity-100' : 'bg-opacity-60',
          state.isMulti ? 'px-4 py-3' : 'p-4',
          bordered && 'border-neutral-grey border'
        ),
      menuPortal: () => '!z-50',
      menu: (state) =>
        unstyled && state.options.length && !state.isLoading
          ? 'bg-grey'
          : 'bg-white mt-1 book-shadow',
      noOptionsMessage: () => 'p-5 text-black/50',
      loadingMessage: () => 'p-5 text-black/50',
      option: (state) =>
        unstyled
          ? 'mb-0.5 last:mb-0'
          : cn(
              'px-5 py-2.5 transition-colors hover:bg-grey/50 flex justify-start',
              state.isFocused && 'bg-grey/50'
            ),
      placeholder: () => 'text-black/20',
      multiValue: () => cn('bg-grey mr-2', pillClasses),
      valueContainer: () => 'gap-y-2'
    },
    components: {
      DropdownIndicator: (props) =>
        showChevron ? (
          <components.DropdownIndicator {...props}>
            <ChevronDown strokeWidth={1} />
          </components.DropdownIndicator>
        ) : null,
      LoadingIndicator: () => <Loader className="mr-2" />,
      ClearIndicator: (props) => (
        <components.ClearIndicator {...props}>
          <X strokeWidth={1} className="cursor-pointer" />
        </components.ClearIndicator>
      ),
      MultiValueRemove: (props) => (
        <components.MultiValueRemove {...props}>
          <X strokeWidth={1} size={16} />
        </components.MultiValueRemove>
      ),
      Option: (props) => {
        if (allowCreate && props.data.__new) {
          return (
            <CreateButton
              value={props.selectProps.inputValue}
              onClick={props.innerProps.onClick}
            />
          )
        } else if (props.data.__new) {
          if (props.options.length > 1) return null
          const noOptionsProps = { ...props, children: undefined }
          return <components.NoOptionsMessage {...noOptionsProps} />
        }

        return <components.Option {...props} />
      }
    }
  } satisfies AsyncCreatableProps<Value, Multi, never>
}

export const CreateButton = ({
  value,
  onClick
}: {
  value: string
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}) => (
  <div
    className={cn(
      pillClasses,
      'bg-neutral-light-grey m-5 !inline-block cursor-pointer self-start'
    )}
    onClick={onClick}
  >
    Add {value}
  </div>
)
