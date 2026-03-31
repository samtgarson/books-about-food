'use server'

import type { File } from 'payload'
import { createImages } from 'src/core/services/images/create-images'
import { call } from 'src/utils/service'

export async function upload(prefix: string, formData: FormData) {
  const blobs = formData.getAll('image') as Blob[]
  const files = await Promise.all(blobs.map(parseFile))

  return call(createImages, {
    files
  })
}

async function parseFile(file: Blob): Promise<File> {
  return {
    data: Buffer.from(await file.arrayBuffer()),
    mimetype: file.type,
    name: file instanceof File ? file.name : 'upload',
    size: file.size
  }
}
