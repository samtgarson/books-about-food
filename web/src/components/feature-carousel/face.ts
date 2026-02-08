import { Book } from 'src/core/models/book'
import { Profile } from 'src/core/models/profile'
import { randomBelow, sample } from 'src/utils/array-helpers'
import { Dot, RandomPlacer } from 'src/utils/random-placer'
import { AvatarSize } from '../atoms/avatar'

const placer = new RandomPlacer(80, 60)
const sizes: AvatarSize[] = ['lg', 'xl', 'xl', 'xl', '2xl', '2xl']

export class Face {
  public nameStyle: Record<string, string>
  public avatarSize: AvatarSize

  constructor(
    public point: Dot,
    public profile: Profile
  ) {
    const nameOffset = randomBelow(40) + 10
    const nameSide = point.x >= 40 && point.x < 75 ? 'left' : 'right'

    this.nameStyle = {
      [nameSide]: `${nameOffset + 50}%`,
      backgroundColor: profile.backgroundColour,
      color: profile.foregroundColour,
      top: randomBelow(80) + 10 + '%'
    }

    this.avatarSize = sample(sizes)
  }

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
}
