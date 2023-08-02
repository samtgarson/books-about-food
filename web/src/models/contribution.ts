import { Job } from 'database'
import { Profile } from './profile'
import { BookAttrs } from './types'

export class Contribution {
  id: string
  job: Job
  profile: Profile

  constructor(attrs: BookAttrs['contributions'][number]) {
    this.id = attrs.id
    this.job = attrs.job
    this.profile = new Profile(attrs.profile)
  }

  get profileName() {
    return this.profile.name
  }

  get jobName() {
    return this.job.name
  }
}
