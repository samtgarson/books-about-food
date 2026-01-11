import { isNodeSelection } from '@tiptap/react'
import type { MenuActions, MenuActiveStates, TiptapEditor } from './types'

/**
 * Creates menu action handlers for the given editor instance.
 * These handlers can be used by any UI implementation.
 */
export function createMenuActions(editor: TiptapEditor): MenuActions {
  return {
    toggleBold: () => editor.chain().focus().toggleBold().run(),
    toggleItalic: () => editor.chain().focus().toggleItalic().run(),
    toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
    toggleBulletList: () => editor.chain().focus().toggleBulletList().run(),
    toggleOrderedList: () => editor.chain().focus().toggleOrderedList().run(),
    setLink: (url: string) => {
      if (url === '') {
        editor.chain().focus().unsetLink().run()
      } else {
        editor.chain().focus().setLink({ href: url }).run()
      }
    },
    unsetLink: () => editor.chain().focus().unsetLink().run(),
    deleteSelection: () => editor.chain().deleteSelection().run()
  }
}

/**
 * Gets the current active states for menu items.
 * Used to highlight active formatting buttons.
 */
export function getMenuActiveStates(editor: TiptapEditor): MenuActiveStates {
  const isImage =
    isNodeSelection(editor.state.selection) &&
    editor.state.selection.node.type.name === 'image'

  return {
    isBoldActive: editor.isActive('bold'),
    isItalicActive: editor.isActive('italic'),
    isUnderlineActive: editor.isActive('underline'),
    isBulletListActive: editor.isActive('bulletList'),
    isOrderedListActive: editor.isActive('orderedList'),
    isLinkActive: editor.isActive('link'),
    isImageSelected: isImage
  }
}

/**
 * Gets the current link URL if a link is selected.
 * Returns empty string if no link is active.
 */
export function getCurrentLink(editor: TiptapEditor): string {
  const { href } = editor.getAttributes('link')
  return `${href || ''}`
}
