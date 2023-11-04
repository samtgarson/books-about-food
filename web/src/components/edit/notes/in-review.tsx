import cn from 'classnames'

export function InReviewNotes({ className }: { className?: string }) {
  return (
    <div className={cn(className, 'flex flex-col gap-2 text-14')}>
      <h3 className="font-medium">Your submission is in review</h3>
      <p>
        Thanks for your submission and contribution to the cookbook community on
        BAF. The review process can take up to a week. We will get in touch if
        we have any questions.
      </p>
      <p>
        Once approved, your submission will appear on the website automatically.
      </p>
    </div>
  )
}
