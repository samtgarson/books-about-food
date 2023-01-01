import { readFile, writeFile } from 'fs/promises'
import mimeType from 'mime-types'
import path from 'path'
import { FileUploader } from 'shared/services/file-uploader'
import replaceAsync from 'string-replace-async'

const regex = /("|,)[^,".]+\.([^(]+) \(([^)]+)\)/g
const uploader = new FileUploader()

const fetchImage = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok)
    throw new Error(`Failed to fetch ${url} with status ${res.status}`)

  const arrBuff = await res.arrayBuffer()
  const buffer = Buffer.from(arrBuff)
  return buffer
}

const replaceFile = async (file: string) => {
  const csvPath = path.resolve(__dirname, 'data', file + '.csv')
  const contents = await readFile(csvPath)
  const replaced = await replaceAsync(
    contents.toString(),
    regex,
    async (_match, divider, extension, url) => {
      if (!url || !extension) return url
      const mime = mimeType.lookup(`.${extension}`)
      if (!mime) throw new Error(`Could not find mime type for ${extension}`)

      console.log(url)
      const buffer = await fetchImage(url)
      const newUrl = await uploader.upload(buffer, mime, 'airtable-import')
      console.log('done')
      return `${divider}${newUrl}`
    }
  )

  await writeFile(csvPath, replaced)
}

replaceFile('book')
