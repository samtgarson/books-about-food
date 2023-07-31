import { components } from 'react-select'
import cn from 'classnames'
import { ChevronDown, X } from 'react-feather'
import { Loader } from 'src/components/atoms/loader'
import { AsyncCreatableProps } from 'react-select/async-creatable'
import { MouseEvent } from 'react'

const pillClasses =
  'text-14 rounded-full px-4 py-2 flex items-center gap-2 leading-none'

export const selectProps = <
  Value extends { [key in ValueKey]: string } & { __new?: true },
  Multi extends boolean,
  ValueKey extends string
>({
  allowCreate,
  valueKey
}: {
  allowCreate?: boolean
  valueKey: ValueKey
}) =>
({
  unstyled: true,
  isClearable: true,
  allowCreateWhileLoading: false,
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
        state.isMulti ? 'px-4 py-3' : 'p-4'
      ),
    menu: () => cn('bg-white mt-1'),
    noOptionsMessage: () => 'p-5 text-black/50',
    loadingMessage: () => 'p-5 text-black/50',
    option: (state) =>
      cn(
        'px-5 py-2.5 transition-colors hover:bg-grey/50 flex justify-start',
        state.isFocused && 'bg-grey/50'
      ),
    placeholder: () => 'text-black/20',
    multiValue: () => cn('bg-grey mr-2', pillClasses)
  },
  components: {
    DropdownIndicator: (props) => (
      <components.DropdownIndicator {...props}>
        <ChevronDown strokeWidth={1} />
      </components.DropdownIndicator>
    ),
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
        return <components.NoOptionsMessage {...props} />
      }

      return <components.Option {...props} />
    }
  }
} satisfies AsyncCreatableProps<Value, Multi, never>)

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
      'bg-grey self-start m-5 !inline-block cursor-pointer'
    )}
    onClick={onClick}
  >
    Add {value}
  </div>
)
