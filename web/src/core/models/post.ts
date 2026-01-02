import { dateString } from '@books-about-food/shared/utils/date'
import { BaseModel } from '.'
import { PostAttrs } from './types'

export class Post extends BaseModel {
  _type = 'post' as const
  public id: string
  public title: string
  public content: string
  public slug: string
  public publishAt: Date | null

  constructor(attrs: PostAttrs) {
    super()
    this.id = attrs.id
    this.title = attrs.title
    this.content = attrs.content
    this.slug = attrs.slug
    this.publishAt = attrs.publishAt
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
