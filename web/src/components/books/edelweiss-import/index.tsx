'use client'

import { useRouter } from 'next/navigation'
import { Form } from 'src/components/form'
import { Input } from 'src/components/form/input'
import { Submit } from 'src/components/form/submit'
import { AdminApiClient } from 'src/lib/admin-api/client'
import { getAdminToken } from 'src/lib/admin-api/token'
import { z } from 'zod'

export function EdelweissImportForm() {
  const router = useRouter()

  return (
    <Form
      schema={z.object({ url: z.string().url() })}
      action={async function (data) {
        const token = await getAdminToken()
        const client = new AdminApiClient(token)
        const result = await client.edelweissImport(data.url)
        if (result.success) router.push(`/edit/${result.data.slug}`)
      }}
    >
      <Input type="url" label="URL" name="url" required />
      <Submit>Import</Submit>
    </Form>
  )
}
