import { BubbleMenu, Editor, isNodeSelection } from '@tiptap/react'
import cn from 'classnames'
import { forwardRef } from 'react'
import {
  Bold,
  Icon,
  Italic,
  Link,
  Trash2,
  Underline
} from 'src/components/atoms/icons'
import EditorLinkSheet from './link-sheet'

const iconAttrs = { size: 18, strokeWidth: 1 }
const buttonClasses = cn(
  'opacity-60 hover:opacity-100 p-1.5 data-[active]:opacity-100 data-[active]:bg-grey rounded transition'
)

const Item = forwardRef<
  HTMLButtonElement,
  {
    onClick?: () => void
    icon: Icon
    active: boolean
  }
>(function Item({ onClick, icon: Icon, active }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={buttonClasses}
      data-active={active || null}
    >
      <Icon {...iconAttrs} />
    </button>
  )
})

export function EditorMenu({
  editor,
  container
}: {
  editor: Editor | null
  container?: HTMLElement
}) {
  if (!editor) return null
  const isImage =
    isNodeSelection(editor.state.selection) &&
    editor.state.selection.node.type.name === 'image'

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ animation: 'fade', interactive: true, zIndex: 60 }}
    >
      <div className={cn('float-menu relative flex justify-between')}>
        {isImage ? (
          <Item
            onClick={() => editor.chain().deleteSelection().run()}
            icon={Trash2}
            active={false}
          />
        ) : (
          <>
            <Item
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              icon={Bold}
            />
            <Item
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              icon={Italic}
            />
            <Item
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              icon={Underline}
            />
            <EditorLinkSheet editor={editor} container={container}>
              <Item active={editor.isActive('link')} icon={Link} />
            </EditorLinkSheet>
          </>
        )}
      </div>
    </BubbleMenu>
  )
}
