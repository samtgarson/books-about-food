'use client'

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { Profile } from 'src/models/profile'
import { UpdateProfileInput } from 'src/services/profiles/update-profile'
import { action } from './action'
import { parse } from 'src/utils/superjson'

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
    console.log('rendering')
  }, [])

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
        console.log('updated', updated)
        setProfile(updated)
        return true
      } catch (error) {
        return false
      }
    },
    [profile, segment]
  )

  return (
    <EditProfileContext.Provider
      value={{ profile, editMode, setEditMode, onSave }}
    >
      {children}
    </EditProfileContext.Provider>
  )
}
