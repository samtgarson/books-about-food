'use client'

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { ProfileItem } from 'src/components/profiles/item'
import { Profile } from 'src/core/models/profile'
import { parse } from 'src/utils/superjson'
import * as Sheet from '../atoms/sheet'
import { SheetControl } from '../atoms/sheet/root'
import { Search } from '../lists/search'
import { fetchProfilesByLocation } from './action'

export type MapProfilesDrawerControl = {
  open(location: string, title: string): Promise<void>
  close(): void
}

export const MapProfilesDrawer = forwardRef<MapProfilesDrawerControl>(
  function MapProfilesDrawer(_, ref) {
    const sheetRef = useRef<SheetControl>(null)
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [title, setTitle] = useState<string | null>(null)

    useImperativeHandle(ref, () => ({
      async open(location, title) {
        setTitle(title)
        setLoading(true)
        sheetRef.current?.setOpen(true)
        const stringified = await fetchProfilesByLocation(location)
        setProfiles(parse(stringified))
        setLoading(false)
      },
      close() {
        console.log('Closing sheet')
        sheetRef.current?.setOpen(false)
      }
    }))

    const filteredProfiles = useMemo(() => {
      if (!search?.length) return profiles
      const lowerSearch = search.toLowerCase()
      return profiles.filter((profile) =>
        profile.name.toLowerCase().includes(lowerSearch)
      )
    }, [profiles, search])

    return (
      <Sheet.Root ref={sheetRef}>
        <Sheet.Content
          title={title ?? 'Profiles'}
          type="drawer"
          className="pb-0!"
          loading={loading}
          wide
          overlay={false}
          controls={
            profiles.length >= 5 && (
              <Search
                value={search}
                onChange={setSearch}
                placeholder="Search profiles"
                className="order-last w-full text-18!"
              />
            )
          }
        >
          <Sheet.Body className="profile-list group -ml-px">
            {filteredProfiles.map((profile, i) => (
              <ProfileItem
                key={profile.id}
                profile={profile}
                index={i}
                display="list"
              />
            ))}
            {!loading && profiles.length === 0 && (
              <p className="text-center text-neutral-grey">No profiles found</p>
            )}
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
    )
  }
)
