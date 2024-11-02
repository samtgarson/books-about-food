import { htmlClasses } from './util'

export function EditorRenderer({ content }: { content: string }) {
  return (
    <div
      className={htmlClasses}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
