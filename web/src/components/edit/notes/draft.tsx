export function DraftNotes({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-medium">Notes on submitting</h3>
      <ol className="list-outside pl-5 list-decimal">
        <li>
          Fill as much of the information as you can. We hope the wider
          community would then help complete the submission.
        </li>
        <li>
          If you are logged in, you can save your progress and come back to it
          later.
        </li>
        <li>
          Only upload good quality flat images of the cover and spreads—not
          photographs of them.
        </li>
        <li>
          The more detail you add the better it represents the book and the
          people involved in creating it.
        </li>
        <li>We will manually check and publish every submission.</li>
      </ol>
      <p>
        Thank you for considering submitting a cookbook. The beauty of this
        platform relies on the community maintaining projects they’ve been a
        part of.
      </p>
    </div>
  )
}
