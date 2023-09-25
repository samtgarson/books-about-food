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
  const result = await updateProfile.call(data)
  if (!result.data) throw result.originalError

  const { data: profile } = result
  const path = `/${segment}/${profile.slug}`
  if (profile.slug !== data.slug) redirect(path)
  return stringify(profile)
}
