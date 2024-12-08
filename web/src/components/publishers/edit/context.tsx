'use client'

import { Publisher } from '@books-about-food/core/models/publisher'
import { UpdatePublisherInput } from '@books-about-food/core/services/publishers/update-publisher'
import { ReactNode, useCallback, useContext } from 'react'
import {
  EditInPlaceProvider,
  createInPlaceContext
} from 'src/components/edit/in-place/context'
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
  publisher
}: {
  children: ReactNode
  publisher: Publisher
}) => {
  const policy = usePolicy(publisher)

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

  return (
    <EditInPlaceProvider
      context={context}
      resource={publisher}
      onSave={save}
      enabled={policy?.update}
    >
      {children}
    </EditInPlaceProvider>
  )
}
