import Color from 'color'
import randomColor from 'randomcolor'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithId = new (...args: any[]) => { id: string };

export function Colourful<TBase extends WithId>(Base: TBase) {
  return class extends Base {
    get backgroundColour() {
      return randomColor({ seed: this.id, luminosity: 'bright' })
    }

    get foregroundColour() {
      return new Color(this.backgroundColour).isDark() ? '#fff' : '#000'
    }
  }
}
