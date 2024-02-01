import { Contribution } from '@books-about-food/core/models/contribution'
import { Profile } from '@books-about-food/core/models/profile'
import { Job } from '@books-about-food/database'
import { useState } from 'react'
import { ContactLink } from 'src/components/atoms/contact-link'
import { jobs } from 'src/components/edit/books/server-actions'
import { Form } from '..'
import { Checkbox } from '../checkbox'
import { ProfileSelect } from '../profile-select'
import { Select } from '../select'
import { Submit } from '../submit'

export type ContributionAttrs = Pick<Contribution, 'profile' | 'job' | 'tag'>

export function ContributionForm({
  onSubmit,
  value
}: {
  onSubmit: (value: ContributionAttrs) => string | void
  value?: ContributionAttrs
}) {
  const [profile, setProfile] = useState<Profile | undefined>(value?.profile)
  const [job, setJob] = useState<Job | undefined>(value?.job)
  const [isAssistant, setIsAssistant] = useState(value?.tag === 'Assistant')

  return (
    <Form
      action={async () => {
        if (!profile || !job) return
        const message = onSubmit({
          profile,
          job,
          tag: isAssistant ? 'Assistant' : undefined
        })
        if (message) return { _: { message } }
      }}
      variant="bordered"
    >
      <ProfileSelect
        multi={false}
        label="Name"
        name="profileName"
        value={profile}
        onCreate={setProfile}
        onChange={setProfile}
      />
      <Select
        loadOptions={jobs}
        label="Job"
        name="jobName"
        valueKey="name"
        render="name"
        multi={false}
        defaultValue={job}
        required
        onChange={(j) => setJob(j)}
      />
      <Checkbox
        name="isAssistant"
        label="Mark as Assistant"
        checked={isAssistant}
        onChange={(e) => setIsAssistant(e.target.checked)}
      />
      <Submit>Save</Submit>
      <p className="text-14 mt-4">
        Note: If the role you would like to assign to this team member isn’t
        listed please choose the most similar then{' '}
        <ContactLink subject="I need a new job role">get in touch</ContactLink>{' '}
        and we’ll do our best to add it.
      </p>
    </Form>
  )
}
