/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from '@books-about-food/core/models'
import {
  Context,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react'
import { errorToast, successToast } from 'src/components/utils/toaster'

export type EditInPlaceContext<
  Resource extends BaseModel,
  UpdateAttrs extends Record<string, any>
> = {
  resource: Resource
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  onSave: (data: UpdateAttrs) => Promise<boolean>
  enabled: boolean
}

export function createInplaceContext<
  Resource extends BaseModel,
  UpdateAttrs extends Record<string, any>
>() {
  return createContext({} as EditInPlaceContext<Resource, UpdateAttrs>)
}

export function EditInPlaceProvider<
  Resource extends BaseModel,
  UpdateAttrs extends Record<string, any>
>({
  context: Context,
  children,
  resource: initialResource,
  onSave: save,
  enabled = false
}: {
  context: Context<EditInPlaceContext<Resource, UpdateAttrs>>
  children: ReactNode
  resource: Resource
  onSave: (data: UpdateAttrs) => Promise<Resource | string | undefined>
  enabled?: boolean
}) {
  const [resource, setResource] = useState(initialResource)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (!editMode) {
      document.body.classList.remove('bg-blue-grey')
    } else {
      document.body.classList.add('bg-blue-grey')
    }
  }, [editMode])

  const onSave = useCallback<
    EditInPlaceContext<Resource, UpdateAttrs>['onSave']
  >(
    async function (data) {
      const result = await save(data)

      if (BaseModel.isModel(result)) {
        setResource(result)
        successToast('Updated successfully')
        return true
      } else {
        errorToast(result || 'Something went wrong')
        return false
      }
    },
    [save]
  )

  return (
    <Context.Provider
      value={{
        resource,
        editMode,
        setEditMode: enabled ? setEditMode : () => {},
        onSave,
        enabled
      }}
    >
      {children}
    </Context.Provider>
  )
}
