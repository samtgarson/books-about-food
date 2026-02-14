import { BubbleMenu, Editor } from '@tiptap/react'
import cn from 'classnames'
import { forwardRef } from 'react'
import {
  Bold,
  Icon,
  Italic,
  Link,
  List,
  ListOrdered,
  Trash2,
  Underline
} from 'src/components/atoms/icons'
import { createMenuActions, getMenuActiveStates } from 'src/lib/editor'
import EditorLinkSheet from './link-sheet'

const iconAttrs = { size: 18, strokeWidth: 1 }
const buttonClasses = cn(
  'opacity-60 hover:opacity-100 p-1.5 data-active:opacity-100 data-active:bg-grey rounded-xs transition'
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
      type="button"
    >
      <Icon {...iconAttrs} />
    </button>
  )
})

const Divider = () => (
  <div className="mx-1 h-5 w-px bg-neutral-grey opacity-30" />
)

export function EditorMenu({
  editor,
  container
}: {
  editor: Editor | null
  container?: HTMLElement
}) {
  if (!editor) return null

  const actions = createMenuActions(editor)
  const states = getMenuActiveStates(editor)

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ animation: 'fade', interactive: true, zIndex: 60 }}
    >
      <div className={cn('relative flex justify-between float-menu')}>
        {states.isImageSelected ? (
          <Item
            onClick={actions.deleteSelection}
            icon={Trash2}
            active={false}
          />
        ) : (
          <>
            <Item
              onClick={actions.toggleBulletList}
              active={states.isBulletListActive}
              icon={List}
            />
            <Item
              onClick={actions.toggleOrderedList}
              active={states.isOrderedListActive}
              icon={ListOrdered}
            />
            <Divider />
            <Item
              onClick={actions.toggleBold}
              active={states.isBoldActive}
              icon={Bold}
            />
            <Item
              onClick={actions.toggleItalic}
              active={states.isItalicActive}
              icon={Italic}
            />
            <Item
              onClick={actions.toggleUnderline}
              active={states.isUnderlineActive}
              icon={Underline}
            />
            <EditorLinkSheet editor={editor} container={container}>
              <Item active={states.isLinkActive} icon={Link} />
            </EditorLinkSheet>
          </>
        )}
      </div>
    </BubbleMenu>
  )
}
