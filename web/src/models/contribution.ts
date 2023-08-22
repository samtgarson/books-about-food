import { Job } from 'database'
import { Profile } from './profile'
import { BookAttrs } from './types'

export class Contribution {
  id: string
  job: Job
  profile: Profile
  tag?: string

  constructor(attrs: BookAttrs['contributions'][number]) {
    this.id = attrs.id
    this.job = attrs.job
    this.profile = new Profile(attrs.profile)
    this.tag = attrs.tag || undefined
  }

  get profileName() {
    return this.profile.name
  }

  get jobName() {
    return this.job.name
  }

  get assistant() {
    return this.tag === 'Assistant'
  }
}
