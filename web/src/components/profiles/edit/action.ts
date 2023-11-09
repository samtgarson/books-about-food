'use server'

import {
  UpdateProfileInput,
  updateProfile
} from 'core/services/profiles/update-profile'
import { redirect } from 'next/navigation'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'

export const action = async (
  segment: 'people' | 'authors',
  data: UpdateProfileInput
) => {
  const result = await call(updateProfile, data)
  if (!result.data) throw result.originalError

  const { data: profile } = result
  const path = `/${segment}/${profile.slug}`
  if (profile.slug !== data.slug) redirect(path)
  return stringify(profile)
}
