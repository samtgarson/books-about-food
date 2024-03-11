'use client'

import { Team } from '@books-about-food/core/models/team'
import { createInviteSchema } from '@books-about-food/core/services/teams/schemas/create-invite'
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

type TeamInviteButtonProps = {
  team: Pick<Team, 'slug' | 'id' | 'name'>
}

const roleOptions: { value: MembershipRole; label: string }[] = Object.values(
  MembershipRole
).map((role) => ({ value: role, label: titleize(role) }))

export function TeamInviteButton({ team }: TeamInviteButtonProps) {
  return (
    <Sheet.Root>
      <Sheet.Trigger>
        <Plus strokeWidth={1} />
      </Sheet.Trigger>
      <Sheet.Content authenticated>
        <Sheet.Body title={`Invite someone to ${team.name}`}>
          <Form
            variant="bordered"
            schema={createInviteSchema.extend({ teamSlug: z.string() })}
            successMessage="Invite sent!"
            action={send}
          >
            <input type="hidden" name="teamId" value={team.id} />
            <input type="hidden" name="teamSlug" value={team.slug} />
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
