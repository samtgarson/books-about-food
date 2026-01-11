import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Editor } from '@tiptap/react'

/**
 * Upload handler function signature.
 * Should upload the file and return the URL of the uploaded image.
 */
export type ImageUploadHandler = (file: File) => Promise<string | null>

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
  uploadHandler: ImageUploadHandler,
  setLoading: (loading: boolean) => void,
  event: ClipboardEvent | DragEvent
) {
  const files = getFileList(event)
  if (!files.length) return
  event.preventDefault()

  setLoading(true)
  const urls = await Promise.all(Array.from(files).map(uploadHandler))

  urls.forEach((url) => {
    if (!url) return
    editor.commands.setImage({ src: url })
    editor.commands.createParagraphNear()
  })

  setLoading(false)

  return false
}

/**
 * Creates a TipTap Image extension with drag-and-drop and paste upload support.
 *
 * @param uploadHandler - Function that handles uploading the file and returns the URL
 * @param setLoading - Callback to set loading state during upload
 */
export function createImageUploader(
  uploadHandler: ImageUploadHandler,
  setLoading: (loading: boolean) => void
) {
  return Image.extend({
    addProseMirrorPlugins() {
      const { editor } = this
      return [
        // Plugin which handles uploading a file when dropped or pasted into the editor
        new Plugin({
          key: new PluginKey('imageDrop'),
          props: {
            handleDOMEvents: {
              drop(_view, event) {
                insertImages(editor, uploadHandler, setLoading, event)
              }
            },
            handlePaste(_view, event) {
              insertImages(editor, uploadHandler, setLoading, event)
            }
          }
        })
      ]
    }
  })
}
