'use server'

import { createImages } from '@books-about-food/core/services/images/create-images'
import prisma from '@books-about-food/database'
// import sharp from 'sharp'
import { call } from 'src/utils/service'
import type { Area } from './cropper-sheet'

export async function upload(
  prefix: string,
  formData: FormData,
  cropArea?: Area
) {
  const blobs = formData.getAll('image') as Blob[]
  const files = await Promise.all(blobs.map(parseFile))

  // TODO: Fix cropping somehow for edge runtime
  // if (files.length === 1 && cropArea) {
  //   files[0].buffer = await cropImage(files[0].buffer, cropArea)
  // }

  return call(createImages, {
    prefix,
    files
  })
}

async function parseFile(file: Blob) {
  return { buffer: Buffer.from(await file.arrayBuffer()), type: file.type }
}

async function cropImage(file: Buffer, cropArea: Area) {
  // const output = await sharp(file)
  //   .extract({
  //     left: cropArea.x,
  //     top: cropArea.y,
  //     width: cropArea.width,
  //     height: cropArea.height
  //   })
  //   .toFormat('png')
  //   .toBuffer()
  //
  // return output
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
