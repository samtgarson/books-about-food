import type { EditorOptions } from '@tiptap/react'
import { useEditor as useTiptapEditor } from '@tiptap/react'
import { stripEmptyParagraphs } from './utils'

/**
 * Options for the useEditor hook
 */
export interface UseEditorOptions {
  /** Initial HTML content */
  value?: string
  /** Callback when content changes */
  onChange?: (value: string) => void
  /** Callback when editor loses focus */
  onBlur?: (event: FocusEvent) => void
  /** Whether the editor is disabled/loading */
  editable?: boolean
  /** TipTap extensions to use */
  extensions: EditorOptions['extensions']
  /** Additional editor props to pass to TipTap */
  editorProps?: EditorOptions['editorProps']
}

/**
 * Shared hook for creating a TipTap editor instance.
 * Wraps useEditor from @tiptap/react with common configuration.
 */
export function useEditor({
  value,
  onChange,
  onBlur,
  editable = true,
  extensions,
  editorProps = {}
}: UseEditorOptions) {
  return useTiptapEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    editable,
    editorProps,
    onUpdate({ editor }) {
      const html = stripEmptyParagraphs(editor.getHTML())
      onChange?.(html)
    },
    onBlur({ event }) {
      onBlur?.(event)
    }
  })
}
