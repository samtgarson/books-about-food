import { useContext } from 'react'
import * as Sheet from 'src/components/atoms/sheet'
import { createCollectionInputContext } from './context'

type SheetContentProps<Value extends { id: string }> = {
  value?: Value
  title?: string
}

export function SheetContent<Value extends { id: string }>({
  value,
  title
}: SheetContentProps<Value>) {
  const Provider = createCollectionInputContext<Value>()
  const { FormComponent, addValue, values } = useContext(Provider)
  const { close } = Sheet.useSheetContext()

  const onSubmit = (val: Value) => {
    if (values.find((v) => v.id === val.id))
      return 'This item has already been added'

    close()
    addValue(val)
  }

  return (
    <Sheet.Content>
      <Sheet.Body title={title}>
        <FormComponent onSubmit={onSubmit} value={value} />
      </Sheet.Body>
    </Sheet.Content>
  )
}
