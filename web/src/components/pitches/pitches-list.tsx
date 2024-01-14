import { fetchAuthoredPitches } from '@books-about-food/core/services/pitches/fetch-authored-pitches'
import Link from 'next/link'
import { call } from 'src/utils/service'

export const PitchesList = async () => {
  const { data: pitches } = await call(fetchAuthoredPitches, undefined)

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
