'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  UpdateProfileInput,
  updateProfile
} from 'src/services/profiles/update-profile'
import { callWithUser } from 'src/utils/call-with-user'

export const action = async (
  segment: 'people' | 'authors',
  data: UpdateProfileInput
) => {
  const { slug } = await callWithUser(updateProfile, data)
  const path = `/${segment}/${slug}`
  if (slug !== data.slug) redirect(path)
  else revalidatePath(path)
}
