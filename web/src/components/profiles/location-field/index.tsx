'use client'

import { Form, Submit } from '@radix-ui/react-form'
import cn from 'classnames'
import { useRef } from 'react'
import { Detail } from 'src/components/atoms/detail'
import * as Sheet from 'src/components/atoms/sheet'
import { Select } from 'src/components/form/select'
import { useDebouncedPromise } from 'src/hooks/use-debounce-promise'
import z from 'zod'
import { useEditProfile } from '../edit/context'
import { Field } from '../edit/field'
import { search } from './action'

const schema = z.object({ location: z.string().nullish().default(null) })

export const LocationField = () => {
  const loadOptions = useDebouncedPromise(search, 250)
  const { onSave, profile, editMode } = useEditProfile()
  const token = useRef(Math.random().toString(36).substring(2, 12))
  const defaultValue = profile.location
    ? profile.location
        .split(' • ')
        .map((loc) => ({ description: loc, id: loc }))
    : undefined

  if (!editMode && !profile.location) return null
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
          <Field disabled attr="location" placeholder="Add a location" />
        </Sheet.Trigger>
        <Sheet.Content>
          {({ close }) => (
            <Form
              action={async (data) => {
                const { location } = schema.parse(
                  Object.fromEntries(data.entries())
                )

                await onSave({ location })
                close()
              }}
            >
              <Sheet.Body grey>
                <Sheet.Header title="Choose a location" />
                <Select
                  name="location"
                  loadOptions={(query) => loadOptions(query, token.current)}
                  render="description"
                  valueKey="id"
                  label="Location"
                  multi
                  defaultValue={defaultValue}
                  separator=" • "
                />
              </Sheet.Body>
              <Sheet.Footer>
                <Submit className="w-full pb-6 pt-4 sm:pt-6">Save</Submit>
              </Sheet.Footer>
            </Form>
          )}
        </Sheet.Content>
      </Sheet.Root>
    </Detail>
  )
}
