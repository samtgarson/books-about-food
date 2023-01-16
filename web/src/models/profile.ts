import { ProfileAttrs } from './types'

export class Profile {
  id: string
  name: string
  slug: string
  website?: string
  instagram?: string
  image?: string
  jobs: string[]

  constructor({
    id,
    name,
    slug,
    website,
    instagram,
    user,
    jobs
  }: ProfileAttrs) {
    this.id = id
    this.name = name
    this.slug = slug
    this.website = website ?? undefined
    this.instagram = instagram ?? undefined
    this.image = user?.image ?? undefined
    this.jobs = jobs.map((job) => job.name)
  }

  get initials() {
    const names = this.name.split(' ')
    return names.reduce((acc, name) => acc + name[0], '')
  }

  get jobNames() {
    return this.jobs.join(' • ')
  }
}
