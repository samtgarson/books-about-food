import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'

async function uploadImage(file: File) {
  console.log('uploading image', file)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    url: 'https://i.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=1280&format=png&auto=webp&s=7177756d1f393b6e093596d06e1ba539f723264b'
  }
}

export function ImageUploader(setLoading: (loading: boolean) => void) {
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
                if (!event?.dataTransfer?.files) return
                const files = event.dataTransfer.files
                const file = files.item(0)
                if (!file) return
                event.preventDefault()

                setLoading(true)
                uploadImage(file).then(({ url }) => {
                  editor.chain().setImage({ src: url }).run()

                  setLoading(false)
                })

                return false
              }
            }
          }
        })
      ]
    }
  })
}
