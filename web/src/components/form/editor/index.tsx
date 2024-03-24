'use client'

import dynamic from 'next/dynamic'
import { Loader } from 'src/components/atoms/loader'
import { EditorProps } from './client'

const EditorClient = dynamic(async () => (await import('./client')).Editor, {
  ssr: false,
  loading: () => (
    <div className="p-4 bg-white">
      <Loader />
    </div>
  )
})

export function Editor(props: EditorProps) {
  return <EditorClient {...props} />
}
