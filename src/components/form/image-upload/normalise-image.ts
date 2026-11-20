// Browsers (notably Windows) often report an empty `type` for HEIC/HEIF and
// sometimes AVIF, so fall back to the file extension to recognise them.
const extensionTypes: Record<string, string> = {
  heic: 'image/heic',
  heif: 'image/heif',
  avif: 'image/avif'
}

const heicTypes = ['image/heic', 'image/heif']

/** File types offered by the picker: anything image-like plus HEIC/AVIF. */
export const acceptedImageTypes = [
  'image/*',
  ...Object.keys(extensionTypes).map((ext) => `.${ext}`)
].join(',')

function imageType(file: File): string | undefined {
  if (file.type.startsWith('image/')) return file.type
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return extensionTypes[ext]
}

export function isImageFile(file: File) {
  return !!imageType(file)
}

function withType(file: File, type: string) {
  return file.type === type ? file : new File([file], file.name, { type })
}

/**
 * Makes an image uploadable: HEIC/HEIF (which neither most browsers nor our
 * server-side sharp build can decode) is converted to JPEG in the browser, and
 * a missing MIME type is filled in from the extension. The HEIC decoder is
 * large, so it is only loaded when a HEIC file is actually chosen.
 */
export async function normaliseImage(file: File): Promise<File> {
  const type = imageType(file) ?? file.type
  if (!heicTypes.includes(type)) return withType(file, type)

  const { heicTo } = await import('heic-to')
  const jpeg = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.92 })
  const name = file.name.replace(/\.(heic|heif)$/i, '') + '.jpg'

  return new File([jpeg], name, { type: 'image/jpeg' })
}
