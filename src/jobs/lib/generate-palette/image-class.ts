import { ImageBase, ImageSource } from '@vibrant/image'
import { Jimp } from 'jimp'

export class JimpImage extends ImageBase {
  private _image?: ImageData

  async load(image: ImageSource): Promise<ImageBase> {
    let buffer: Buffer
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        const res = await fetch(image)
        buffer = Buffer.from(await res.arrayBuffer())
      } else {
        return Promise.reject(new Error('File path loading not supported'))
      }
    } else if (image instanceof Buffer) {
      buffer = image
    } else {
      return Promise.reject(new Error('Invalid image source'))
    }

    const jimpImage = await Jimp.fromBuffer(buffer)
    jimpImage.resize({ w: 200, h: 200 })

    const width = jimpImage.width
    const height = jimpImage.height
    const bitmap = jimpImage.bitmap

    this._image = {
      width,
      height,
      data: new Uint8ClampedArray(bitmap.data) as never,
      colorSpace: 'srgb'
    }
    return this
  }

  clear(): void {}
  update(): void {}
  getWidth(): number {
    return this._image!.width
  }

  getHeight(): number {
    return this._image!.height
  }

  resize(_targetWidth: number, _targetHeight: number, _ratio: number): void {
    // done in the load step, ignoring any maxDimension or quality options
  }

  getPixelCount(): number {
    const { width, height } = this._image!
    return width * height
  }

  getImageData(): ImageData {
    return this._image!
  }

  remove(): void {}
}
