import { NextResponse } from 'next/server'
import { getUser } from 'src/utils/service'
import { updateSession } from 'src/utils/session'

export async function POST() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ role: null })

    await updateSession({ role: user.role })
    return NextResponse.json({ role: user.role })
  } catch (error) {
    console.error(error)
  }
}
