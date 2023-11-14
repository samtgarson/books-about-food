'use server'

import { createImages } from '@books-about-food/core/services/images/create-images'
import { call } from 'src/utils/service'

export async function action(prefix: string, formData: FormData) {
  const files = formData.getAll('image') as Blob[]

  return call(createImages, {
    prefix,
    files: await Promise.all(files.map(parseFile))
  })
}

async function parseFile(file: Blob) {
  return { buffer: Buffer.from(await file.arrayBuffer()), type: file.type }
}
