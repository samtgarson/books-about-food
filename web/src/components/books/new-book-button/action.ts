'use server'

import prisma from 'database'
import { redirect } from 'next/navigation'
import { slugify } from 'shared/utils/slugify'
import { FormAction } from 'src/components/form'
import { getUser } from 'src/services/auth/get-user'
import { z } from 'zod'

const schema = z.object({ title: z.string().nonempty() })

export const createBook: FormAction = async (values) => {
  const { title } = schema.parse(values)

  const slug = slugify(title)
  const user = await getUser.call()
  if (!user) redirect('auth/sign-in')

  const book = await prisma.book.create({
    data: { title, slug, submitterId: user.id }
  })

  redirect(`/edit/${book.slug}`)
}
