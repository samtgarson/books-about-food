import Color from 'color'
import randomColor from 'randomcolor'
import { Link } from 'src/components/atoms/link-list'
import { normalizeLink } from 'src/utils/url-helpers'
import { Image } from './image'
import { ProfileAttrs } from './types'

export class Profile {
  id: string
  name: string
  description?: string
  slug: string
  website?: string
  instagram?: string
  avatar?: Image
  jobs: string[]

  constructor({
    id,
    name,
    slug,
    website,
    instagram,
    jobs,
    avatar,
    description
  }: ProfileAttrs) {
    this.id = id
    this.name = name
    this.description = description ?? undefined
    this.slug = slug
    this.website = normalizeLink(website ?? undefined)
    this.instagram = instagram ?? undefined
    this.avatar = avatar ? new Image(avatar, `Avatar for ${name}`) : undefined
    this.jobs = jobs.map((job) => job.name)
  }

  get initials() {
    const names = this.name.split(' ')
    return names.reduce((acc, name) => acc + name[0], '')
  }

  get jobNames() {
    if (!this.jobs.length) return
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

  get backgroundColour() {
    return randomColor({ seed: this.id, luminosity: 'bright' })
  }

  get foregroundColour() {
    return new Color(this.backgroundColour).isDark() ? '#fff' : '#000'
  }
}
