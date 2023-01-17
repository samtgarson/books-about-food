import { Link } from 'src/components/atoms/link-list'
import { normalizeLink } from 'src/utils/url-helpers'
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
    this.website = normalizeLink(website ?? undefined)
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

  get links(): Link[] {
    const links = []
    if (this.website) {
      const name = new URL(this.website).hostname
      links.push({ name, url: this.website })
    }

    if (this.instagram)
      links.push({
        name: `@${this.instagram}`,
        url: `https://instagram.com/${this.instagram}`
      })
    return links
  }
}
