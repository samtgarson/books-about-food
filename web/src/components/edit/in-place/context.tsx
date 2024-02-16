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
  UpdateAttrs extends Record<string, any>,
  ExtraContext extends Record<string, any> = Record<string, unknown>
> = {
  resource: Resource
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  onSave: (data: UpdateAttrs) => Promise<boolean>
  enabled: boolean
} & ExtraContext

export function createInPlaceContext<
  Resource extends BaseModel,
  UpdateAttrs extends Record<string, any>,
  ExtraContext extends Record<string, any> = Record<string, unknown>
>() {
  return createContext({
    editMode: false,
    enabled: false
  } as EditInPlaceContext<Resource, UpdateAttrs, ExtraContext>)
}

export function EditInPlaceProvider<
  Resource extends BaseModel,
  UpdateAttrs extends Record<string, any>,
  ExtraContext extends Record<string, any> = Record<string, unknown>
>({
  context: Context,
  children,
  resource: initialResource,
  onSave: save,
  enabled = false,
  extra
}: {
  context: Context<EditInPlaceContext<Resource, UpdateAttrs, ExtraContext>>
  children: ReactNode
  resource: Resource
  onSave: (data: UpdateAttrs) => Promise<Resource | string | undefined>
  enabled?: boolean
  extra?: ExtraContext
}) {
  const [resource, setResource] = useState(initialResource)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (!editMode) {
      document.body.classList.remove('editing')
    } else {
      document.body.classList.add('editing')
    }

    return () => {
      document.body.classList.remove('editing')
    }
  }, [editMode])

  const onSave = useCallback(
    async function (data: UpdateAttrs) {
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
      value={
        {
          resource,
          editMode,
          setEditMode: enabled ? setEditMode : () => {},
          onSave,
          enabled,
          ...extra
        } as EditInPlaceContext<Resource, UpdateAttrs, ExtraContext>
      }
    >
      {children}
    </Context.Provider>
  )
}
