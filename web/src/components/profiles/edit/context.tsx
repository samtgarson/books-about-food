'use client'

import { Profile } from 'core/models/profile'
import { UpdateProfileInput } from 'core/services/profiles/update-profile'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { toast } from 'sonner'
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
      try {
        const updated = parse(
          await action(segment, { ...data, slug: profile.slug })
        )
        setProfile(updated)
        toast('Profile updated')
        return true
      } catch (error) {
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
