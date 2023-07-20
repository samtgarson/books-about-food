import { User } from 'database'
import Link from 'next/link'
import { fetchAuthoredPitches } from 'src/services/pitches/fetch-authored-pitches'

export type PitchesListProps = { user: User }

export const PitchesList = async ({ user }: PitchesListProps) => {
  const pitches = await fetchAuthoredPitches.call(undefined, user)

  if (!pitches?.length) return <p>You have no open pitches</p>

  return (
    <>
      {pitches.map((pitch) => (
        <p key={pitch.id}>
          <Link href={`/pitches/${pitch.id}`}>{pitch.description}</Link>
        </p>
      ))}
    </>
  )
}
