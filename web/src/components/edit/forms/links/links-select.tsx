'use client'

import { FullBook } from '@books-about-food/core/models/full-book'
import { isWebsite, websites } from '@books-about-food/shared/data/websites'
import Image from 'next/image'
import { useState } from 'react'
import { linkLogos } from 'src/assets/link-logos'
import { Form } from 'src/components/form'
import { CollectionInput } from 'src/components/form/collection-input'
import { Input } from 'src/components/form/input'
import { Select } from 'src/components/form/select'
import { Submit } from 'src/components/form/submit'
import { stringify } from 'src/utils/superjson'
import { v4 as uuid } from 'uuid'

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
      title="Add Links"
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

  const options = websites.map((value) => ({ value }))
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
      variant="bordered"
    >
      <Select
        loadOptions={async (val) =>
          stringify(
            options.filter((o) =>
              o.value.toLowerCase().includes(val.toLowerCase())
            )
          )
        }
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
      <Submit variant="dark" className="mt-4">
        Save
      </Submit>
      <p className="text-14 mt-4">
        Note: If the website you would like to add isn’t listed please enter the
        name in the Website field and click Create (eg: “Portfolio”, “New York
        Times”, “The Grocer” etc).
      </p>
    </Form>
  )
}

const linkLogo = (site: string) =>
  isWebsite(site) ? (
    <div className="h-10 w-10 rounded-full bg-white flex justify-center items-center overflow-hidden">
      <Image src={linkLogos[site]} alt="" width={24} height={24} />
    </div>
  ) : (
    <div className="h-10 w-10 rounded-full bg-white/50" />
  )
