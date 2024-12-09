import cn from 'classnames'
import { htmlClasses } from './util'

export function EditorRenderer({
  content,
  className
}: {
  content: string
  className?: string
}) {
  return (
    <div
      className={cn(className, htmlClasses)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
