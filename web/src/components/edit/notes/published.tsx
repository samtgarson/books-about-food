export function PublishedNotes({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-medium">Your submission has been published!</h3>
      <p>
        Thanks for your submission and contribution to the cookbook community on
        BAF.
      </p>
      <p>
        If you’d like to suggest new edits to your submission, please hit the
        Suggest an Edit button above.
      </p>
    </div>
  )
}
