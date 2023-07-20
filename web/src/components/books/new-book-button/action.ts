'use server'

import prisma from 'database'
import { redirect } from 'next/navigation'
import { slugify } from 'shared/utils/slugify'
import { getUser } from 'src/services/auth/get-user'
import { z } from 'zod'

const schema = z.object({ title: z.string().nonempty() })

export async function createBook(data: FormData) {
  const values = Object.fromEntries(data.entries())
  const { title } = schema.parse(values)

  const slug = slugify(title)
  const user = await getUser.call()
  if (!user) redirect('auth/sign-in')

  const book = await prisma.book.create({
    data: { title, slug, submitterId: user.id }
  })

  redirect(`/edit/${book.slug}`)
}
