import { notFound } from 'next/navigation'
import { ImportForm } from 'src/components/admin/import/form'
import { getUser } from 'src/services/auth/get-user'

export default async function Admin() {
  const { data: user } = await getUser.call()
  if (user?.role !== 'admin') notFound()

  return (
    <>
      <ImportForm />
    </>
  )
}
