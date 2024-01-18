import { NextResponse } from 'next/server'
import { actions } from 'src/auth'
import { getSessionUser } from 'src/utils/user'

export async function POST() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ user: null })

    const session = await actions.update({ user })
    return NextResponse.json(session)
  } catch (error) {
    console.error(error)
  }
}
