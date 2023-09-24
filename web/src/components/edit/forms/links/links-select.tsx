'use client'

import { useState } from 'react'
import { Header } from 'src/components/atoms/sheet'
import { Form } from 'src/components/form'
import { CollectionInput } from 'src/components/form/collection-input'
import { Input } from 'src/components/form/input'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { FullBook } from 'src/models/full-book'
import { v4 as uuid } from 'uuid'
import { websites } from 'shared/data/websites'
import { linkLogos } from 'src/assets/link-logos'
import Image from 'next/image'

export type LinksSelectValue = {
  id: string
  site: string
  url: string
}

export function LinksSelect({ book }: { book: FullBook }) {
  return (
    <CollectionInput<LinksSelectValue>
      name="links"
      label="Links"
      defaultValue={book.links}
      form={LinksForm}
      render={(value) => ({
        title: value.site,
        subtitle: value.url,
        avatar: linkLogo(value.site)
      })}
    />
  )
}

function LinksForm({
  onSubmit,
  value
}: {
  onSubmit: (value: LinksSelectValue) => void
  value?: LinksSelectValue
}) {
  const [site, setSite] = useState(value?.site ?? null)
  const [url, setUrl] = useState(value?.url ?? null)

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        if (!site || !url) return
        onSubmit({
          id: value?.id || uuid(),
          site,
          url
        })
      }}
    >
      <Header title="Add Links Member" />
      <Select
        options={websites.map((value) => ({ value }))}
        label="Website"
        name="site"
        render="value"
        defaultValue={value?.site ? { value: value.site } : undefined}
        valueKey="value"
        required
        onChange={(p) => setSite(p ? (p as { value: string }).value : null)}
        allowCreate
      />
      <Input
        label="URL"
        name="url"
        defaultValue={value?.url}
        required
        onChange={(e) => setUrl(e.target.value)}
      />
      <Submit variant="dark">Save</Submit>
      <p className="text-14 mt-8">
        Note: If the website you would like to add isn’t listed please choose
        “Other” and give it a title in the form field that appears (eg:
        “Portfolio”, “New York Times”, “The Grocer” etc).
      </p>
    </Form>
  )
}

const linkLogo = (site: string) =>
  site in linkLogos ? (
    <Image
      src={linkLogos[site]}
      alt=""
      width={40}
      height={40}
      className="rounded-full"
    />
  ) : (
    <div className="h-10 w-10 rounded-full bg-white/50" />
  )
