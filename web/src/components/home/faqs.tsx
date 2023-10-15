'use client'

import { FrequentlyAskedQuestion } from 'database'
import { useState } from 'react'
import * as Accordion from 'src/components/atoms/accordion'
import { Search } from '../lists/search'

export function Faqs({ questions }: { questions: FrequentlyAskedQuestion[] }) {
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
        className="w-full mb-4"
        onChange={setSearch}
        value={search}
        onReset={() => setSearch('')}
      />
      <Accordion.Root type="multiple" className="flex gap-x-8 flex-wrap">
        {[left, right].map((questions, index) => (
          <div key={index} className="flex-[500px] flex flex-col gap-4">
            {questions.map(({ question, id, answer }) => (
              <Accordion.Item title={question} value={id} key={id}>
                <div
                  dangerouslySetInnerHTML={{ __html: answer }}
                  className="max-w-prose"
                />
              </Accordion.Item>
            ))}
          </div>
        ))}
      </Accordion.Root>
    </>
  )
}
