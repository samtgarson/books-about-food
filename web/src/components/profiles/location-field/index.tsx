'use client'

import cn from 'classnames'
import { useRef, useState } from 'react'
import { Detail } from 'src/components/atoms/detail'
import * as Sheet from 'src/components/atoms/sheet'
import { InPlaceField } from 'src/components/edit/in-place/field'
import { Form } from 'src/components/form'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { useDebouncedPromise } from 'src/hooks/use-debounce-promise'
import { useEditProfile } from '../edit/context'
import { search } from './action'

type LocationOption = {
  displayText: string
  placeId: string
  id: string
}

export function LocationField() {
  const loadOptions = useDebouncedPromise(search, 250)
  const { onSave, profile, editMode } = useEditProfile()
  const token = useRef(Math.random().toString(36).substring(2, 12))

  const defaultValue: LocationOption[] = profile.locations.map((loc) => ({
    displayText: loc.displayText,
    placeId: loc.placeId,
    id: loc.placeId
  }))

  const [selection, setSelection] = useState<LocationOption[]>(defaultValue)

  // if (!editMode && profile.locations.length === 0) return null
  if (!editMode && !profile.location?.length) return null
  return (
    <Detail maxWidth>
      <Sheet.Root>
        <Sheet.Trigger
          className={cn(
            'w-full self-start',
            !editMode && 'pointer-events-none'
          )}
          tabIndex={editMode ? undefined : -1}
          aria-label="Edit location"
        >
          <InPlaceField
            disabled
            value={profile.location}
            editMode={editMode}
            onSave={async () => true}
            placeholder="Add a location"
            className="text-left"
          />
        </Sheet.Trigger>
        <Sheet.Content title="Choose a location">
          {({ close }) => (
            <Form
              action={async () => {
                const locations = selection.map(({ placeId, displayText }) => ({
                  placeId,
                  displayText
                }))
                await onSave({ locations })
                close()
              }}
              variant="bordered"
            >
              <Sheet.Body>
                <Select<LocationOption, true, 'id'>
                  name="locations"
                  loadOptions={(query) => loadOptions(query, token.current)}
                  render="displayText"
                  valueKey="id"
                  label="Location"
                  multi
                  defaultValue={defaultValue}
                  onChange={setSelection}
                  separator=" • "
                />
              </Sheet.Body>
              <Sheet.Footer>
                <Submit className="w-full">Save</Submit>
              </Sheet.Footer>
            </Form>
          )}
        </Sheet.Content>
      </Sheet.Root>
    </Detail>
  )
}
