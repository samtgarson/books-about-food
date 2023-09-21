export function InReviewNotes({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-medium">Your submission is in review</h3>
      <p>
        Thanks for your submission and contribution to the cookbook community on
        BAF.
      </p>
      <p>
        We will manually review your submission before publishing it and get in
        touch if we have any questions. Due to the traffic we’re experiencing,
        the review process can take up to a week.
      </p>
    </div>
  )
}
