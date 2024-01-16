'use server'

import {
  UpdateProfileInput,
  updateProfile
} from '@books-about-food/core/services/profiles/update-profile'
import { redirect } from 'next/navigation'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'

export const action = async (
  segment: 'people' | 'authors',
  data: UpdateProfileInput
) => {
  const result = await call(updateProfile, data)
  console.log(result)
  if (!result.success) return result

  const { data: profile } = result
  const path = `/${segment}/${profile.slug}`
  if (profile.slug !== data.slug) redirect(path)
  return { ...result, data: stringify(profile) }
}
