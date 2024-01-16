'use client'

import { Profile } from '@books-about-food/core/models/profile'
import { UpdateProfileInput } from '@books-about-food/core/services/profiles/update-profile'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { errorToast, successToast } from 'src/components/utils/toaster'
import { parse } from 'src/utils/superjson'
import { action } from './action'

export type EditProfileContext = {
  profile: Profile
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  onSave: (data: Omit<UpdateProfileInput, 'slug'>) => Promise<boolean>
}

const EditProfileContext = createContext({} as EditProfileContext)

export const useEditProfile = () => useContext(EditProfileContext)

export const EditProfileProvider = ({
  children,
  segment,
  profile: initialProfile
}: {
  children: ReactNode
  profile: Profile
  segment: 'authors' | 'people'
}) => {
  const [profile, setProfile] = useState(initialProfile)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (!editMode) {
      document.body.classList.remove('bg-blue-grey')
    } else {
      document.body.classList.add('bg-blue-grey')
    }
  }, [editMode])

  const onSave: EditProfileContext['onSave'] = useCallback(
    async (data) => {
      const result = await action(segment, { ...data, slug: profile.slug })
      if (result.success) {
        setProfile(parse(result.data))
        successToast('Profile updated')
        return true
      } else {
        if (result.errors[0].type === 'InvalidInput') {
          errorToast(result.errors[0].message)
        } else {
          errorToast('Something went wrong')
        }
        return false
      }
    },
    [profile.slug, segment]
  )

  return (
    <EditProfileContext.Provider
      value={{ profile, editMode, setEditMode, onSave }}
    >
      {children}
    </EditProfileContext.Provider>
  )
}
