'use client'
import { ReactNode } from 'react'
import { Form } from 'src/components/form'
import { errorToast, successToast } from 'src/components/utils/toaster'

export function EditForm({
  action,
  children
}: {
  action: (data: unknown) => Promise<boolean>
  children: ReactNode
}) {
  return (
    <Form
      action={async (data) => {
        const success = await action(data)
        if (!success)
          errorToast('Something went wrong', {
            description: 'Please try again'
          })

        successToast('Cookbook saved')
        history.back()
      }}
    >
      {children}
    </Form>
  )
}
