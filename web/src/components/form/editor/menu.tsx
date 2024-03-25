import { BubbleMenu, Editor } from '@tiptap/react'
import cn from 'classnames'
import { forwardRef } from 'react'
import { Bold, Icon, Italic, Link, Underline } from 'src/components/atoms/icons'
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
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ animation: 'fade', interactive: true, zIndex: 60 }}
    >
      <div className={cn('float-menu flex justify-between relative')}>
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
      </div>
    </BubbleMenu>
  )
}
