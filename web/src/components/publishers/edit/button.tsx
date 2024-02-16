import { Button } from 'src/components/atoms/button'
import { Check, Edit2 } from 'src/components/atoms/icons'
import { useEditPublisher } from './context'

export function EditPublisherButton({ className }: { className?: string }) {
  const { editMode, setEditMode, promo } = useEditPublisher()

  return (
    <>
      <Button
        onClick={() => setEditMode(!editMode)}
        variant={editMode || !promo ? 'primary' : 'secondary'}
        className={className}
      >
        {editMode ? <Check strokeWidth={1} /> : <Edit2 strokeWidth={1} />}
        {editMode ? 'Finish Editing' : 'Edit'}
      </Button>
    </>
  )
}
