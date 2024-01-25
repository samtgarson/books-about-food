'use client'

import { FullBook } from '@books-about-food/core/models/full-book'
import { Image } from '@books-about-food/core/models/image'
import { Profile } from '@books-about-food/core/models/profile'
import { ContributorAttrs } from '@books-about-food/core/services/books/update-contributors'
import { Job } from '@books-about-food/database'
import { BaseAvatar } from 'src/components/atoms/avatar'
import { CollectionInput } from 'src/components/form/collection-input'
import { ContributionForm } from 'src/components/form/contribution-form'
import { useCurrentUser } from 'src/hooks/use-current-user'

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
        onSubmit(
          toValue(value?.id || '', v.profile, v.job, v.tag === 'Assistant')
        )
      }
    />
  )
}
