import { Bold } from '@tiptap/extension-bold'
import { BulletList } from '@tiptap/extension-bullet-list'
import { Document } from '@tiptap/extension-document'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { History } from '@tiptap/extension-history'
import { Italic } from '@tiptap/extension-italic'
import { Link } from '@tiptap/extension-link'
import { ListItem } from '@tiptap/extension-list-item'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Text } from '@tiptap/extension-text'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import type { AnyExtension } from '@tiptap/react'
import type { ExtensionsOptions } from './types'

/**
 * Creates the core TipTap extensions used by all editor implementations.
 * Extensions can be augmented by passing an optional image uploader extension.
 */
export function createExtensions(
  options: ExtensionsOptions = {},
  imageUploaderExtension?: AnyExtension
) {
  const { placeholder = 'Write something...' } = options

  const extensions: AnyExtension[] = [
    Bold,
    BulletList,
    Document,
    Dropcursor,
    History,
    Italic,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
        target: '_blank'
      }
    }),
    ListItem,
    OrderedList,
    Paragraph,
    Placeholder.configure({
      placeholder
    }),
    Text,
    Typography,
    Underline
  ]

  // Add optional image uploader extension
  if (imageUploaderExtension) {
    extensions.push(imageUploaderExtension)
  }

  return extensions
}
