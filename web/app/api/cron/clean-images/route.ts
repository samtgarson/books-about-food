import { NextResponse } from 'next/server'
import { cleanImages } from 'src/services/images/clean-images'
import { secure } from '../utils/secure'

export const GET = secure(async () => {
  try {
    const count = await cleanImages.call()
    return NextResponse.json({ ok: true, deletedImages: count })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
})
