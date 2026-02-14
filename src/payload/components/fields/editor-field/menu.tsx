'use client'

import { BubbleMenu } from '@tiptap/react'
import cn from 'classnames'
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Trash2,
  Underline,
  type LucideIcon
} from 'lucide-react'
import {
  createMenuActions,
  getMenuActiveStates,
  type TiptapEditor
} from 'src/lib/editor'
import { EditorLinkModal } from './link-modal'

const iconProps = { size: 14, strokeWidth: 2.5 }

function MenuItem({
  onClick,
  icon: Icon,
  active,
  disabled,
  buttonKey
}: {
  onClick?: () => void
  icon: LucideIcon
  active: boolean
  disabled?: boolean
  buttonKey: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'toolbar-popup__button',
        `toolbar-popup__button-${buttonKey}`,
        active && 'active',
        disabled && 'disabled'
      )}
      data-button-key={buttonKey}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon {...iconProps} className="icon" />
    </button>
  )
}

const Divider = () => <div className="divider" />

export function EditorMenu({ editor }: { editor: TiptapEditor | null }) {
  if (!editor) return null

  const actions = createMenuActions(editor)
  const states = getMenuActiveStates(editor)

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ animation: 'fade', interactive: true, zIndex: 60 }}
    >
      <div className="inline-toolbar-popup">
        {states.isImageSelected ? (
          <MenuItem
            onClick={actions.deleteSelection}
            icon={Trash2}
            active={false}
            buttonKey="delete-image"
          />
        ) : (
          <>
            <MenuItem
              onClick={actions.toggleBulletList}
              active={states.isBulletListActive}
              icon={List}
              buttonKey="bullet-list"
            />
            <MenuItem
              onClick={actions.toggleOrderedList}
              active={states.isOrderedListActive}
              icon={ListOrdered}
              buttonKey="ordered-list"
            />
            <Divider />
            <MenuItem
              onClick={actions.toggleBold}
              active={states.isBoldActive}
              icon={Bold}
              buttonKey="bold"
            />
            <MenuItem
              onClick={actions.toggleItalic}
              active={states.isItalicActive}
              icon={Italic}
              buttonKey="italic"
            />
            <MenuItem
              onClick={actions.toggleUnderline}
              active={states.isUnderlineActive}
              icon={Underline}
              buttonKey="underline"
            />
            <EditorLinkModal editor={editor}>
              <MenuItem
                active={states.isLinkActive}
                icon={Link}
                buttonKey="link"
              />
            </EditorLinkModal>
          </>
        )}
      </div>
    </BubbleMenu>
  )
}
