'use server'

import { getImages } from 'src/core/services/images/get-images'
import type { Image } from 'src/payload/payload-types'
import { call } from 'src/utils/service'

// Shared by the admin image-upload fields (cover + preview images) to hydrate
// the gallery from the image ids already stored on the document.
export async function loadImages(ids: string[]): Promise<Image[]> {
  const { data } = await call(getImages, { ids })
  return data ?? []
}
