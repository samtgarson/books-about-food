import { Job } from '@books-about-food/database'
import { Profile } from './profile'
import { BookAttrs } from './types'

export class Contribution {
  id: string
  job: Job
  profile: Profile
  tag?: string
  hidden: boolean

  constructor(attrs: BookAttrs['contributions'][number]) {
    this.id = attrs.id
    this.job = attrs.job
    this.profile = new Profile(attrs.profile)
    this.tag = attrs.tag || undefined
    this.hidden = !!attrs.hidden
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
