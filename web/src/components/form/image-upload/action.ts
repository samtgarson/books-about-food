'use server'

import prisma from '@books-about-food/database'
import type { File } from 'payload'
import sharp from 'sharp'
import { createImages } from 'src/core/services/images/create-images'
import { call } from 'src/utils/service'
import type { Area } from './cropper-sheet'

export async function upload(
  prefix: string,
  formData: FormData,
  cropArea?: Area
) {
  const blobs = formData.getAll('image') as Blob[]
  const files = await Promise.all(blobs.map(parseFile))

  if (files.length === 1 && cropArea) {
    files[0].data = await cropImage(files[0].data, cropArea)
  }

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

async function cropImage(file: Buffer, cropArea: Area) {
  const output = await sharp(file)
    .extract({
      left: cropArea.x,
      top: cropArea.y,
      width: cropArea.width,
      height: cropArea.height
    })
    .toFormat('png')
    .toBuffer()

  // TODO: Upgrade Typscript to remove this cast
  return output as Buffer<ArrayBuffer>
}

export async function reorderImages(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, order) =>
      prisma.image.update({
        where: { id },
        data: { order }
      })
    )
  )
}
