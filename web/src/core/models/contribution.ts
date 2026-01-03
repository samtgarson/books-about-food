import type {
  Book as PayloadBook,
  Job as PayloadJob,
  Profile as PayloadProfile
} from 'src/payload/payload-types'
import { Profile } from './profile'
import { requirePopulated } from './utils/payload-validation'

type ContributionAttrs = NonNullable<PayloadBook['contributions']>[number]

export class Contribution {
  id: string
  job: PayloadJob
  profile: Profile
  tag?: string
  hidden: boolean

  constructor(attrs: ContributionAttrs) {
    // Validate relationships are populated
    const profile = requirePopulated<PayloadProfile>(
      attrs.profile,
      'Contribution.profile'
    )
    const job = requirePopulated<PayloadJob>(attrs.job, 'Contribution.job')

    this.id = attrs.id ?? ''
    this.job = job
    this.profile = new Profile(profile as typeof profile & { profile: never })
    this.tag = attrs.tag ?? undefined
    this.hidden = false // Book contributions array doesn't have hidden field
  }

  get profileName() {
    return this.profile.name
  }

  get jobName() {
    if (!this.tag) return this.job.name
    return `${this.job.name} (${this.tag})`
  }

  get assistant() {
    return this.tag === 'Assistant'
  }
}
