import { imageUrl } from '@books-about-food/shared/utils/image-url'
import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor } from '@tiptap/react'
import { upload } from '../image-upload/action'

async function uploadImage(prefix: string, file: File) {
  console.log('uploading image', file)
  const fd = new FormData()
  fd.append('image', file, file.name)
  const { data: [result] = [] } = await upload(`editor/${prefix}`, fd)

  return imageUrl(result.path)
}

function getFileList(event: ClipboardEvent | DragEvent) {
  if (event instanceof ClipboardEvent) {
    return Array.from(event.clipboardData?.files || [])
  } else if (event instanceof DragEvent) {
    return Array.from(event.dataTransfer?.files || [])
  }

  return []
}

async function insertImages(
  editor: Editor,
  prefix: string,
  setLoading: (loading: boolean) => void,
  event: ClipboardEvent | DragEvent
) {
  const files = getFileList(event)
  if (!files.length) return
  event.preventDefault()

  setLoading(true)
  const urls = await Promise.all(
    Array.from(files).map((file) => uploadImage(prefix, file))
  )

  urls.forEach((url) => {
    editor.commands.setImage({ src: url })
    editor.commands.createParagraphNear()
  })

  setLoading(false)

  return false
}

export function ImageUploader(
  setLoading: (loading: boolean) => void,
  prefix: string
) {
  return Image.extend({
    addProseMirrorPlugins() {
      const { editor } = this
      return [
        // a plugin which handles uploading a file when one is dropped into the editor
        new Plugin({
          key: new PluginKey('imageDrop'),
          props: {
            handleDOMEvents: {
              drop(_view, event) {
                insertImages(editor, prefix, setLoading, event)
              }
            },
            handlePaste(_view, event) {
              insertImages(editor, prefix, setLoading, event)
            }
          }
        })
      ]
    }
  })
}
