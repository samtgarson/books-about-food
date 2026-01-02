'use client'

import { ReactNode, useCallback, useContext } from 'react'
import {
  EditInPlaceProvider,
  createInPlaceContext
} from 'src/components/edit/in-place/context'
import { Profile } from 'src/core/models/profile'
import { UpdateProfileInput } from 'src/core/services/profiles/update-profile'
import { usePolicy } from 'src/hooks/use-policy'
import { parse } from 'src/utils/superjson'
import { action } from './action'

const context = createInPlaceContext<
  Profile,
  Omit<UpdateProfileInput, 'slug'>
>()
export function useEditProfile() {
  const ctx = useContext(context)
  return { ...ctx, profile: ctx.resource }
}

export const EditProfileProvider = ({
  children,
  segment,
  profile
}: {
  children: ReactNode
  profile: Profile
  segment: 'authors' | 'people'
}) => {
  const policy = usePolicy(profile)
  const save = useCallback(
    async function (data: Omit<UpdateProfileInput, 'slug'>) {
      const result = await action(segment, { ...data, slug: profile.slug })
      if (result.success) {
        return parse(result.data)
      } else {
        if (result.errors[0].type === 'InvalidInput') {
          return result.errors[0].message
        } else {
          return 'Something went wrong'
        }
      }
    },
    [profile.slug, segment]
  )

  return (
    <EditInPlaceProvider
      context={context}
      resource={profile}
      onSave={save}
      enabled={policy?.update}
    >
      {children}
    </EditInPlaceProvider>
  )
}
