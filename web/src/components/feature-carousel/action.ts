'use server'

import prisma from '@books-about-food/database'
import { revalidatePath } from 'next/cache'
import { getSessionUser } from 'src/utils/user'

export async function updateFeatureCarousel(items: string[]) {
  const user = await getSessionUser()
  if (user?.role !== 'admin') return

  await prisma.$transaction(
    items.map((id, order) =>
      prisma.feature.update({
        where: { id },
        data: { order }
      })
    )
  )

  revalidatePath('/')
}
