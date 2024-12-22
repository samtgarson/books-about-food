'use client'

import { Publisher } from '@books-about-food/core/models/publisher'
import { createInviteSchema } from '@books-about-food/core/services/memberships/schemas/create-invite'
import { MembershipRole } from '@books-about-food/database/client'
import { titleize } from 'inflection'
import * as Sheet from 'src/components/atoms/sheet'
import { z } from 'zod'
import { Plus } from '../atoms/icons'
import { Form } from '../form'
import { Input } from '../form/input'
import { Select } from '../form/select'
import { Submit } from '../form/submit'
import { send } from './action'

type PublisherInviteButtonProps = {
  publisher: Pick<Publisher, 'id' | 'name' | 'slug'>
}

const roleOptions: { value: MembershipRole; label: string }[] = Object.values(
  MembershipRole
).map((role) => ({ value: role, label: titleize(role) }))

export function PublisherInviteButton({
  publisher
}: PublisherInviteButtonProps) {
  return (
    <Sheet.Root>
      <Sheet.Trigger>
        <Plus strokeWidth={1} />
      </Sheet.Trigger>
      <Sheet.Content authenticated>
        <Sheet.Header title={`Invite someone to ${publisher.name}`} />
        <Sheet.Body>
          <Form
            variant="bordered"
            schema={createInviteSchema.extend({ publisherSlug: z.string() })}
            successMessage="Invite sent!"
            action={send}
          >
            <input type="hidden" name="publisherId" value={publisher.id} />
            <input type="hidden" name="publisherSlug" value={publisher.slug} />
            <Input type="email" name="email" label="Email address" required />
            <Select
              options={roleOptions}
              multi={false}
              name="role"
              label="Role"
              defaultValue={{
                value: MembershipRole.member,
                label: titleize(MembershipRole.member)
              }}
              valueKey="value"
              render="label"
            />
            <Submit>Send Invite</Submit>
          </Form>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
