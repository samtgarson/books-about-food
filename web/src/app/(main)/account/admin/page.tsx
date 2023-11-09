import { notFound } from 'next/navigation'
import { ImportForm } from 'src/components/admin/import/form'
import { getUser } from 'src/utils/service'

export default async function Admin() {
  const user = await getUser()
  if (user?.role !== 'admin') notFound()

  return (
    <>
      <ImportForm />
    </>
  )
}
