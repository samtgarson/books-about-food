import { useContext } from 'react'
import { Trash } from 'react-feather'
import * as Sheet from 'src/components/atoms/sheet'
import { createCollectionInputContext } from './context'
import { SheetContent } from './sheet-content'
import { CollectionInputItemProps } from './types'

export function CollectionInputItem<Value extends { id: string }>({
  avatar,
  title,
  subtitle,
  value
}: CollectionInputItemProps & { value: Value }) {
  const Provider = createCollectionInputContext<Value>()
  const { removeValue } = useContext(Provider)
  return (
    <div className="-mb-px flex items-center gap-4 border border-black p-5">
      {avatar}
      <div className="flex flex-col">
        <p className="font-bold">{title}</p>
        {subtitle && <p className="opacity-50">{subtitle}</p>}
      </div>
      <Sheet.Root>
        <Sheet.Trigger className="text-14 ml-auto underline">
          Edit
        </Sheet.Trigger>
        <SheetContent<Value> value={value} />
      </Sheet.Root>
      <button onClick={() => removeValue(value.id)} type="button">
        <Trash strokeWidth={1} />
      </button>
    </div>
  )
}
