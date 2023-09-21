'use server'

import { redirect } from 'next/navigation'
import {
  UpdateProfileInput,
  updateProfile
} from 'src/services/profiles/update-profile'
import { stringify } from 'src/utils/superjson'

export const action = async (
  segment: 'people' | 'authors',
  data: UpdateProfileInput
) => {
  const profile = await updateProfile.call(data)
  const path = `/${segment}/${profile.slug}`
  if (profile.slug !== data.slug) redirect(path)
  return stringify(profile)
}
