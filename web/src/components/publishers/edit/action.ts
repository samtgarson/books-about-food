'use server'

import { redirect } from 'next/navigation'
import {
  UpdatePublisherInput,
  updatePublisher
} from 'src/core/services/publishers/update-publisher'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'

export const action = async (data: UpdatePublisherInput) => {
  const result = await call(updatePublisher, data)
  if (!result.success) return result

  const { data: publisher } = result

  const path = `/publishers/${publisher.slug}`
  if (publisher.slug !== data.slug) redirect(path)

  return { ...result, data: stringify(publisher) }
}
