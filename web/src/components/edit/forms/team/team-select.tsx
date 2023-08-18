'use client'

import { Job } from 'database'
import { useState } from 'react'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { ContactLink } from 'src/components/atoms/contact-link'
import { Header } from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { CollectionInput } from 'src/components/form/collection-input'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { Image } from 'src/models/image'
import { Profile } from 'src/models/profile'
import { jobs, profiles } from 'src/services/server-actions'
import { v4 as uuid } from 'uuid'

export type TeamSelectValue = {
  id: string
  profileName: string
  avatar?: Image
  jobName: string
  fg: string
  bg: string
}

const toValue = (id: string, profile: Profile, job: Job): TeamSelectValue => ({
  id: id,
  profileName: profile.name,
  jobName: job.name,
  avatar: profile.avatar,
  fg: profile.foregroundColour,
  bg: profile.backgroundColour
})

export function TeamSelect({ book }: { book: FullBook }) {
  return (
    <CollectionInput<TeamSelectValue>
      name="contributors"
      label="Team"
      required
      defaultValue={book.contributions.map((contribution) =>
        toValue(contribution.id, contribution.profile, contribution.job)
      )}
      serialize={({ profileName, jobName }) => ({ profileName, jobName })}
      form={TeamForm}
      render={(value) => ({
        title: value.profileName,
        subtitle: value.jobName,
        avatar: (
          <BaseAvatar
            size="xs"
            imgProps={value.avatar?.imageAttrs()}
            backup={value.profileName}
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
      name: value.profileName,
      foregroundColour: value.fg,
      backgroundColour: value.bg,
      avatar: value.avatar
    } as Profile)
    : null
  const defaultJob = value ? ({ name: value?.jobName } as Job) : null
  const [profile, setProfile] = useState<Profile | null>(defaultProfile)
  const [job, setJob] = useState<Job | null>(defaultJob)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        if (!profile || !job) return
        onSubmit(toValue(value?.id ?? uuid(), profile, job))
      }}
    >
      <Header title="Add Team Member" />
      <Select
        loadOptions={profiles}
        label="Name"
        name="profileName"
        valueKey="name"
        render={(profile) => profile.name}
        defaultValue={defaultProfile}
        required
        allowCreate
        onChange={(p) => setProfile(p as Profile)}
      />
      <Select
        loadOptions={jobs}
        label="Job"
        name="jobName"
        valueKey="name"
        render={(job) => job.name}
        defaultValue={defaultJob}
        required
        onChange={(j) => setJob(j as Job)}
      />
      <Submit variant="dark">Save</Submit>
      <p className="text-14 mt-8">
        Note: If the role you would like to assign to this team member isn’t
        listed please choose “Other” and{' '}
        <ContactLink subject="I need a new job role">get in touch</ContactLink>.
      </p>
    </Form>
  )
}
