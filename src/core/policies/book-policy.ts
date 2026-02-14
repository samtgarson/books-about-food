import { FullBook } from 'src/core/models/full-book'
import { Policy } from './base'

export class BookPolicy extends Policy<FullBook> {
  get update() {
    if (this.user.role === 'admin') return true
    if (this.isSubmitter && this.resource.status !== 'published') return true
    if (
      this.resource.publisher &&
      this.user.publishers.includes(this.resource.publisher.id)
    )
      return true
    return false
  }

  private get isSubmitter() {
    return this.user.id === this.resource.submitterId
  }
}
