'use client'
import { Editor } from '@tiptap/react'
import { ReactNode, useCallback, useRef } from 'react'
import { Button } from 'src/components/atoms/button'
import * as Sheet from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'

export type EditorLinkSheetProps = {
  editor: Editor
  children?: ReactNode
}

function EditorLinkSheet({ editor, children }: EditorLinkSheetProps) {
  const sheet = useRef<Sheet.SheetControl>(null)
  const handleLink = useCallback(
    function (link: string) {
      if (!editor || !link.length) return

      const currentPosition = editor.state.selection
      sheet.current?.setOpen(false)
      editor.chain().setLink({ href: link }).focus(currentPosition.to).run()
    },
    [editor, sheet]
  )

  return (
    <Sheet.Root ref={sheet} onClose={() => editor.commands.focus()}>
      <Sheet.Trigger asChild>{children}</Sheet.Trigger>
      <Sheet.Content focusTriggerOnClose={false}>
        <Sheet.Body>
          <Form
            variant="bordered"
            onSubmit={(e) => {
              e.preventDefault()
              handleLink(e.currentTarget.link.value)
            }}
          >
            <Input
              label="Link"
              name="link"
              defaultValue={editor.getAttributes('link').href}
              placeholder="https://..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  sheet.current?.setOpen(false)
                  editor.commands.unsetLink()
                }}
                className="mr-auto"
              >
                Clear
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => sheet.current?.setOpen(false)}
              >
                Cancel
              </Button>
              <Submit>Save</Submit>
            </div>
          </Form>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}

export default EditorLinkSheet
