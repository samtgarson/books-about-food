/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ImageBase, ImageSource } from '@vibrant/image'
import sharp from 'sharp'

export class SharpImage extends ImageBase {
  private _image?: ImageData

  async load(image: ImageSource): Promise<ImageBase> {
    let source: Buffer | string
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        const res = await fetch(image)
        source = Buffer.from(await res.arrayBuffer())
      } else source = image
    } else if (image instanceof Buffer) {
      source = image
    } else {
      return Promise.reject(new Error('Invalid image source'))
    }

    if (typeof image === 'string' || image instanceof Buffer) {
      const { data, info } = await sharp(source)
        .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      this._image = {
        width: info.width,
        height: info.height,
        data: data as unknown as Uint8ClampedArray,
        colorSpace: 'srgb'
      }
      return this
    } else {
      return Promise.reject(
        new Error('Cannot load image from HTMLImageElement in node environment')
      )
    }
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
