'use server'

import { redirect } from 'next/navigation'
import {
  UpdateProfileInput,
  updateProfile
} from 'src/services/profiles/update-profile'
import { callWithUser } from 'src/utils/call-with-user'
import { stringify } from 'src/utils/superjson'

export const action = async (
  segment: 'people' | 'authors',
  data: UpdateProfileInput
) => {
  const profile = await callWithUser(updateProfile, data)
  const path = `/${segment}/${profile.slug}`
  if (profile.slug !== data.slug) redirect(path)
  return stringify(profile)
}
