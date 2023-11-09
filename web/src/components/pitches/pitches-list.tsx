import { fetchAuthoredPitches } from 'core/services/pitches/fetch-authored-pitches'
import { User } from 'database'
import Link from 'next/link'
import { call } from 'src/utils/service'

export type PitchesListProps = { user: User }

export const PitchesList = async ({ user }: PitchesListProps) => {
  const { data: pitches } = await call(fetchAuthoredPitches, undefined, user)

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
