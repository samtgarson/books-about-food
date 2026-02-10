/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Context,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState
} from 'react'
import { errorToast, successToast } from 'src/components/utils/toaster'
import { BaseModel } from 'src/core/models'
import { usePrevious } from 'src/hooks/use-previous'
import { revalidate } from './action'

export type EditInPlaceContext<
  Resource extends BaseModel,
  UpdateAttrs extends Record<string, any>,
  ExtraContext extends Record<string, any> = Record<string, unknown>
> = {
  resource: Resource
  editMode: boolean
  onSave: (data: UpdateAttrs) => Promise<boolean>
  enabled: boolean
  loading: boolean
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
  editMode = false,
  extra
}: {
  context: Context<EditInPlaceContext<Resource, UpdateAttrs, ExtraContext>>
  children: ReactNode
  resource: Resource
  onSave: (data: UpdateAttrs) => Promise<Resource | string | undefined>
  enabled?: boolean
  editMode?: boolean
  extra?: ExtraContext
}) {
  const [resource, setResource] = useState(initialResource)
  const [changed, setChanged] = useState(false)
  const previousEditMode = usePrevious(editMode)
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    if (!editMode && previousEditMode && changed) {
      revalidate(resource.href)
      setChanged(false)
    }
  }, [editMode, changed, resource.href, previousEditMode])

  const onSave = useCallback(
    async function (data: UpdateAttrs) {
      setLoading(true)
      const result = await save(data)

      if (BaseModel.isModel(result)) {
        setChanged(true)
        setResource(result)
        successToast('Updated successfully')
        setLoading(false)
        return true
      } else {
        errorToast(result || 'Something went wrong')
        setLoading(false)
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
          editMode: enabled && editMode,
          onSave,
          loading,
          enabled,
          ...extra
        } as EditInPlaceContext<Resource, UpdateAttrs, ExtraContext>
      }
    >
      {children}
    </Context.Provider>
  )
}
