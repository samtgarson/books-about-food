import { useContext } from 'react'
import { X } from 'src/components/atoms/icons'
import * as Sheet from 'src/components/atoms/sheet'
import { createCollectionInputContext } from './context'
import { SheetContent } from './sheet-content'
import { CollectionInputItemProps } from './types'

export function CollectionInputItem<Value extends { id: string }>({
  image: avatar,
  title,
  subtitle,
  value
}: CollectionInputItemProps & { value: Value }) {
  const Provider = createCollectionInputContext<Value>()
  const { removeValue } = useContext(Provider)
  return (
    <div className="-mb-px flex items-center gap-4 border-t border-neutral-grey py-4">
      {avatar}
      <div className="flex flex-col overflow-hidden">
        <p className="font-bold truncate">{title}</p>
        {subtitle && <p className="truncate opacity-50">{subtitle}</p>}
      </div>
      <Sheet.Root>
        <Sheet.Trigger className="ml-auto text-14 underline">
          Edit
        </Sheet.Trigger>
        <SheetContent<Value> title="Edit Team Member" value={value} />
      </Sheet.Root>
      <button onClick={() => removeValue(value.id)} type="button">
        <X strokeWidth={1} />
      </button>
    </div>
  )
}
