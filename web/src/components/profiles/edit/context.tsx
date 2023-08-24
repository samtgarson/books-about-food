'use client'

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition
} from 'react'
import { Profile } from 'src/models/profile'
import { UpdateProfileInput } from 'src/services/profiles/update-profile'
import { action } from './action'

export type EditProfileContext = {
  profile: Profile
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  onSave: (data: Omit<UpdateProfileInput, 'slug'>) => void
}

const EditProfileContext = createContext({} as EditProfileContext)

export const useEditProfile = () => useContext(EditProfileContext)

export const EditProfileProvider = ({
  children,
  segment,
  profile
}: {
  children: ReactNode
  profile: Profile
  segment: 'authors' | 'people'
}) => {
  const [editMode, setEditMode] = useState(false)
  const [_pending, startTransition] = useTransition()

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
      startTransition(async () => {
        console.log('saving', data)
        try {
          await action(segment, { ...data, slug: profile.slug })
          console.log('saved')
        } catch (error) {
          console.error(error)
        }
      })
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
