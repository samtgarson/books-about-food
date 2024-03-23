import { Book } from '@books-about-food/core/models/book'
import { Profile } from '@books-about-food/core/models/profile'
import { randomBelow, sample } from 'src/utils/array-helpers'
import { Dot, RandomPlacer } from 'src/utils/random-placer'
import { AvatarSize } from '../atoms/avatar'

const placer = new RandomPlacer(80, 60)
const sizes: AvatarSize[] = ['lg', 'xl', 'xl', 'xl', '2xl', '2xl']

export class Face {
  constructor(
    public point: Dot,
    public profile: Profile
  ) {}

  static forBooks(books: Book[]) {
    const authors = books.reduce((arr, book) => {
      book.authors.forEach((author) => {
        if (!arr.find((a) => a.id === author.id)) arr.push(author)
      })
      return arr
    }, [] as Profile[])
    const points = placer.call(authors.length)
    return authors.map((author, i) => new Face(points[i], author))
  }

  private nameOffset = randomBelow(40) + 10
  private nameSide = this.point.x >= 40 && this.point.x < 75 ? 'left' : 'right'

  public nameStyle = {
    [this.nameSide]: `${this.nameOffset + 50}%`,
    backgroundColor: this.profile.backgroundColour,
    color: this.profile.foregroundColour,
    top: randomBelow(80) + 10 + '%'
  }

  public avatarSize = sample(sizes)
}
