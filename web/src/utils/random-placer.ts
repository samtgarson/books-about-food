// https://jsfiddle.net/pendensproditor/2XyV5

export class Dot {
  constructor(public x: number, public y: number) { }
}

export class RandomPlacer {
  constructor(private width: number, private height: number) { }

  private samples = 50 // candidate dots attempted, higher is better
  private placedDots: Dot[] = [] // a dot is represented as [x, y]
  private dotCount = 0

  call(count: number) {
    this.dotCount = count
    while (this.placedDots.length < this.dotCount) {
      this.placeNewDot()
    }
    return this.placedDots
  }

  generateRandomPosition() {
    return new Dot(
      Math.round(Math.random() * this.width),
      Math.round(Math.random() * this.height)
    )
  }

  getDistanceToNearestDot(dot: Dot) {
    let shortest
    for (let i = this.placedDots.length - 1; i >= 0; i--) {
      const distance = this.getDistance(this.placedDots[i], dot)
      if (!shortest || distance < shortest) shortest = distance
    }
    return shortest as number
  }

  getDistance(dot1: Dot, dot2: Dot) {
    const xDistance = Math.abs(dot1.x - dot2.x),
      yDistance = Math.abs(dot1.y - dot2.y),
      distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
    return Math.floor(distance)
  }

  generateBestDot() {
    let bestDot, bestDotDistance
    for (let i = 0; i < this.samples; i++) {
      const candidateDot = this.generateRandomPosition()
      if (!this.placedDots.length) return candidateDot
      const distance = this.getDistanceToNearestDot(candidateDot)
      if (
        !bestDot ||
        !bestDotDistance ||
        (distance > bestDotDistance && this.notCentered(candidateDot))
      ) {
        bestDot = candidateDot
        bestDotDistance = distance
      }
    }
    return bestDot as Dot
  }

  placeNewDot() {
    const dot = this.generateBestDot()
    this.placedDots.push(dot)
  }

  private notCentered(dot: Dot) {
    const x = dot.x <= this.width * 0.4 || dot.x > this.width * 0.5
    const y = dot.y <= this.height * 0.3 || dot.y > this.height * 0.5
    return x && y
  }
}
