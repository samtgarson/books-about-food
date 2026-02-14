'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useCallback, useContext } from 'react'
import {
  EditInPlaceProvider,
  createInPlaceContext
} from 'src/components/edit/in-place/context'
import { Publisher } from 'src/core/models/publisher'
import { UpdatePublisherInput } from 'src/core/services/publishers/update-publisher'
import { usePolicy } from 'src/hooks/use-policy'
import { parse } from 'src/utils/superjson'
import { action } from './action'

const context = createInPlaceContext<
  Publisher,
  Omit<UpdatePublisherInput, 'slug'>
>()

export function useEditPublisher() {
  const ctx = useContext(context)
  return { ...ctx, publisher: ctx.resource }
}

export const EditPublisherProvider = ({
  children,
  publisher,
  editMode = false
}: {
  children: ReactNode
  publisher: Publisher
  editMode?: boolean
}) => {
  const enabled = usePolicy(publisher)?.update
  const router = useRouter()

  const save = useCallback(
    async function (data: Omit<UpdatePublisherInput, 'slug'>) {
      const result = await action({ ...data, slug: publisher.slug })
      if (result.success) {
        return parse(result.data)
      } else {
        if (result.errors[0].type === 'InvalidInput') {
          return result.errors[0].message
        } else {
          return 'Something went wrong'
        }
      }
    },
    [publisher.slug]
  )

  if (editMode && !enabled) {
    router.replace(`/publishers/${publisher.slug}`, { scroll: false })
    return null
  }

  return (
    <EditInPlaceProvider
      context={context}
      resource={publisher}
      onSave={save}
      enabled={enabled}
      editMode={editMode}
    >
      {children}
    </EditInPlaceProvider>
  )
}
