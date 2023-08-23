'use server'

import { createImages } from 'src/services/images/create-images'

export async function action(prefix: string, formData: FormData) {
  const files = formData.getAll('image') as Blob[]

  return createImages.call({
    prefix,
    files: await Promise.all(files.map(parseFile))
  })
}

async function parseFile(file: Blob) {
  return { buffer: Buffer.from(await file.arrayBuffer()), type: file.type }
}
