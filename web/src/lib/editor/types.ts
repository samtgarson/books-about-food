import { Editor as TiptapEditor } from '@tiptap/react'

/**
 * Core editor props shared across all implementations
 */
export interface EditorProps {
  /** Placeholder text shown when editor is empty */
  placeholder?: string
  /** Initial HTML content */
  value?: string
  /** Callback when content changes */
  onChange?: (value: string) => void
  /** Callback when editor loses focus */
  onBlur?: () => void
  /** HTML id attribute */
  id?: string
}

/**
 * Options for creating TipTap extensions
 */
export interface ExtensionsOptions {
  /** Placeholder text for empty editor */
  placeholder?: string
  /** Callback to set loading state (for image uploads) */
  setLoading?: (loading: boolean) => void
  /** URL prefix for image uploads */
  imagePrefix?: string
}

/**
 * Menu action type for formatting operations
 */
export type MenuAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'link'
  | 'bulletList'
  | 'orderedList'
  | 'deleteImage'

/**
 * Menu action handlers
 */
export interface MenuActions {
  toggleBold: () => void
  toggleItalic: () => void
  toggleUnderline: () => void
  toggleBulletList: () => void
  toggleOrderedList: () => void
  setLink: (url: string) => void
  unsetLink: () => void
  deleteSelection: () => void
}

/**
 * Menu action active states
 */
export interface MenuActiveStates {
  isBoldActive: boolean
  isItalicActive: boolean
  isUnderlineActive: boolean
  isBulletListActive: boolean
  isOrderedListActive: boolean
  isLinkActive: boolean
  isImageSelected: boolean
}

export type { TiptapEditor }
