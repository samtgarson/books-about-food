'use client'

import { FullBook } from '@books-about-food/core/models/full-book'
import { Image } from '@books-about-food/core/models/image'
import { Profile } from '@books-about-food/core/models/profile'
import { ContributorAttrs } from '@books-about-food/core/services/books/update-contributors'
import { Job } from '@books-about-food/database'
import { useState } from 'react'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { ContactLink } from 'src/components/atoms/contact-link'
import { Form } from 'src/components/form'
import { Checkbox } from 'src/components/form/checkbox'
import { CollectionInput } from 'src/components/form/collection-input'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { useCurrentUser } from 'src/hooks/use-current-user'
import { v4 as uuid } from 'uuid'
import { jobs, profiles } from '../../server-actions'
import { createProfile } from '../title/action'

export type TeamSelectValue = ContributorAttrs & {
  id: string
  name: string
  avatar?: Image
  fg: string
  bg: string
}

const toValue = (
  id: string,
  profile: Profile,
  job: Job,
  assistant?: boolean
): TeamSelectValue => ({
  id: id,
  profileId: profile.id,
  name: profile.name,
  jobName: job.name,
  avatar: profile.avatar,
  fg: profile.foregroundColour,
  bg: profile.backgroundColour,
  assistant
})

export function TeamSelect({ book }: { book: FullBook }) {
  const user = useCurrentUser()

  return (
    <CollectionInput<TeamSelectValue, ContributorAttrs>
      name="contributors"
      label="Team"
      title="Add Team Member"
      required={user?.role !== 'admin'}
      defaultValue={book.contributions
        .map((contribution) =>
          toValue(
            contribution.id,
            contribution.profile,
            contribution.job,
            contribution.assistant
          )
        )
        .sort((a, b) => a.name.localeCompare(b.name))}
      serialize={({ profileId, jobName, assistant = false }) => ({
        profileId,
        jobName,
        assistant
      })}
      form={TeamForm}
      render={(value) => ({
        title: value.name,
        subtitle: `${value.jobName}${value.assistant ? ' (Assistant)' : ''}`,
        avatar: (
          <BaseAvatar
            size="xs"
            imgProps={value.avatar?.imageAttrs()}
            backup={value.name}
            foregroundColour={value.fg}
            backgroundColour={value.bg}
          />
        )
      })}
    />
  )
}

function TeamForm({
  onSubmit,
  value
}: {
  onSubmit: (value: TeamSelectValue) => void
  value?: TeamSelectValue
}) {
  const defaultProfile = value
    ? ({
        id: value.profileId,
        name: value.name,
        foregroundColour: value.fg,
        backgroundColour: value.bg,
        avatar: value.avatar
      } as Profile)
    : null
  const defaultJob = value ? ({ name: value?.jobName } as Job) : null
  const [profile, setProfile] = useState<Profile | null>(defaultProfile)
  const [job, setJob] = useState<Job | null>(defaultJob)
  const [isAssistant, setIsAssistant] = useState(false)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        if (!profile || !job) return
        onSubmit(toValue(value?.id ?? uuid(), profile, job, isAssistant))
      }}
      variant="bordered"
    >
      <Select
        loadOptions={profiles}
        label="Name"
        name="profileName"
        valueKey="name"
        render="name"
        defaultValue={defaultProfile}
        required
        allowCreate
        onChange={(p) => setProfile(p as Profile)}
        onCreate={async (name) => {
          const attrs = await createProfile(name)
          const profile = new Profile(attrs)
          setProfile(profile)
          return profile
        }}
      />
      <Select
        loadOptions={jobs}
        label="Job"
        name="jobName"
        valueKey="name"
        render="name"
        defaultValue={defaultJob}
        required
        onChange={(j) => setJob(j as Job)}
      />
      <Checkbox
        name="isAssistant"
        label="Mark as Assistant"
        checked={isAssistant}
        onChange={(e) => setIsAssistant(e.target.checked)}
      />
      <Submit className="mt-4" variant="dark">
        Save
      </Submit>
      <p className="text-14 mt-4">
        Note: If the role you would like to assign to this team member isn’t
        listed please choose the most similar then{' '}
        <ContactLink subject="I need a new job role">get in touch</ContactLink>{' '}
        and we’ll do our best to add it.
      </p>
    </Form>
  )
}
