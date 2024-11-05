import { AccountHeader } from 'src/components/accounts/header'
import { PostForm } from 'src/components/posts/form'

export default async function Posts() {
  return (
    <>
      <AccountHeader title="New Post" />
      <PostForm />
    </>
  )
}
