import { randomBelow, sample } from 'src/utils/array-helpers'
import { RandomPlacer, Dot } from 'src/utils/random-placer'
import { AvatarSize } from '../atoms/avatar'
import { Feature } from 'src/services/features/fetch-features'
import { Profile } from 'src/models/profile'

const placer = new RandomPlacer(80, 60)
const sizes: AvatarSize[] = ['xl', '2xl', '2xl', '2xl', '3xl', '3xl']

export class Face {
  constructor(public point: Dot, public profile: Profile) { }

  static forFeatures(features: Feature[]) {
    const authors = features.reduce((arr, { book }) => {
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
