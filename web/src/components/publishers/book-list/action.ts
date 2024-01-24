'use server'

import { updatePublisher } from '@books-about-food/core/services/publishers/update-publisher'
import { call } from 'src/utils/service'

export async function updateVisibility(slug: string, hiddenBooks: string[]) {
  'use server'

  await call(updatePublisher, {
    slug: slug,
    hiddenBooks
  })
}
