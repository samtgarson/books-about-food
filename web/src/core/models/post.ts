import { dateString } from '@books-about-food/shared/utils/date'
import type { Post as PayloadPost } from 'src/payload/payload-types'
import { BaseModel } from '.'

export class Post extends BaseModel {
  _type = 'post' as const
  public id: string
  public title: string
  public content: string
  public slug: string
  public publishAt: Date | null

  constructor(attrs: PayloadPost) {
    super()
    this.id = attrs.id
    this.title = attrs.title
    this.content = attrs.content // Lexical JSON content
    this.slug = attrs.slug
    this.publishAt = attrs.publishAt ? new Date(attrs.publishAt) : null
  }

  get name() {
    return this.title
  }

  get href() {
    return `/posts/${this.id}`
  }

  get publishAtString() {
    return dateString(this.publishAt ?? undefined)
  }
}
