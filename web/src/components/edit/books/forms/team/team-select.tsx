'use client'

import { Job } from '@books-about-food/database'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { CollectionInput } from 'src/components/form/collection-input'
import { ContributionForm } from 'src/components/form/contribution-form'
import { FullBook } from 'src/core/models/full-book'
import { Image } from 'src/core/models/image'
import { Profile } from 'src/core/models/profile'
import { ContributorAttrs } from 'src/core/services/books/update-contributors'
import { useCurrentUser } from 'src/hooks/use-current-user'

export type TeamSelectValue = ContributorAttrs & {
  id: string
  name: string
  avatar?: Image
  fg: string
  bg: string
}

const toValue = (
  profile: Profile,
  job: Job,
  assistant?: boolean
): TeamSelectValue => ({
  id: `${profile.id}|${job.id}`,
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
        image: (
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
  onSubmit: (value: TeamSelectValue) => string | void
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
    : undefined
  const defaultJob = value ? ({ name: value?.jobName } as Job) : undefined

  return (
    <ContributionForm
      value={
        defaultProfile &&
        defaultJob && {
          profile: defaultProfile,
          job: defaultJob,
          tag: value?.assistant ? 'Assistant' : undefined
        }
      }
      onSubmit={(v) =>
        onSubmit(toValue(v.profile, v.job, v.tag === 'Assistant'))
      }
    />
  )
}
