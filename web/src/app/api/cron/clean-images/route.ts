import { cleanImages } from '@books-about-food/core/services/images/clean-images'
import { NextResponse } from 'next/server'
import { call } from 'src/utils/service'
import { secure } from '../secure'

export const GET = secure(async () => {
  try {
    const count = await call(cleanImages)
    console.log(`Deleted ${count} images`)
    return NextResponse.json({ ok: true, deletedImages: count })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
})
