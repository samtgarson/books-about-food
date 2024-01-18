import { notFound } from 'next/navigation'
import { ImportForm } from 'src/components/admin/import/form'
import { getSessionUser } from 'src/utils/user'

export default async function Admin() {
  const user = await getSessionUser()
  if (user?.role !== 'admin') notFound()

  return (
    <>
      <ImportForm />
    </>
  )
}
