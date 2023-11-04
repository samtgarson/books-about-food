import cn from 'classnames'

export function PublishedNotes({ className }: { className?: string }) {
  return (
    <div className={cn(className, 'flex flex-col gap-2 text-14')}>
      <h3 className="font-medium">Your submission has been published!</h3>
      <p>
        Thanks for your submission and contribution to the cookbook community on
        BAF. If you’d like to add or suggest new edits to your submission, click
        the button below.
      </p>
    </div>
  )
}
