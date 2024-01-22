import { FullBook } from '@books-about-food/core/models/full-book'
import { Policy } from './base'

export class BookPolicy extends Policy<FullBook> {
  get update() {
    if (this.user.role === 'admin') return true
    if (this.isSubmitter && this.resource.status !== 'published') return true
    if (
      this.resource.publisher?.teamId &&
      this.user.teams.includes(this.resource.publisher.teamId)
    )
      return true
    return false
  }

  private get isSubmitter() {
    return this.user.id === this.resource.submitterId
  }
}
