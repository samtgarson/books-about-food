import { Button } from 'src/components/atoms/button'
import { Check, Edit2 } from 'src/components/atoms/icons'
import { useNav } from 'src/components/nav/context'
import { useEditPublisher } from './context'

export function EditPublisherButton({ className }: { className?: string }) {
  const { editMode, publisher, loading } = useEditPublisher()
  const href = editMode
    ? `/publishers/${publisher.slug}`
    : `/publishers/${publisher.slug}/edit`
  const { internalLoading } = useNav()

  return (
    <Button
      href={href}
      scroll={false}
      variant={editMode ? 'primary' : 'tertiary'}
      className={className}
      loading={loading || internalLoading}
      replace
    >
      {editMode ? <Check strokeWidth={1} /> : <Edit2 strokeWidth={1} />}
      {editMode ? 'Finish Editing' : 'Edit Publsher'}
    </Button>
  )
}
