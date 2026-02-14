'use client'

import { useState } from 'react'
import * as Accordion from 'src/components/atoms/accordion'
import type { FAQ } from 'src/payload/payload-types'
import { EditorRenderer } from '../form/editor/renderer'
import { Search } from '../lists/search'

export function FAQs({ questions }: { questions: FAQ[] }) {
  const [search, setSearch] = useState('')
  const filtered = questions.filter(
    ({ question, answer }) =>
      question.toLowerCase().includes(search.toLowerCase()) ||
      answer.toLowerCase().includes(search.toLowerCase())
  )
  const left = filtered.slice(0, Math.ceil(filtered.length / 2))
  const right = filtered.slice(Math.ceil(filtered.length / 2))

  return (
    <>
      <Search
        placeholder="Search..."
        className="mb-4 w-full"
        onChange={setSearch}
        value={search}
        onReset={() => setSearch('')}
      />
      <Accordion.Root
        type="multiple"
        className="flex flex-wrap gap-x-8 gap-y-4"
      >
        {[left, right].map((questions, index) => (
          <div key={index} className="flex flex-[500px] flex-col gap-4">
            {questions.map(({ question, id, answer }) => (
              <Accordion.Item title={question} value={id} key={id}>
                <EditorRenderer
                  content={answer}
                  className="prose max-w-prose"
                />
              </Accordion.Item>
            ))}
          </div>
        ))}
      </Accordion.Root>
    </>
  )
}
