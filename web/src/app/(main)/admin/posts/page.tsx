import prisma from '@books-about-food/database'
import { AccountHeader } from 'src/components/accounts/header'
import { Button } from 'src/components/atoms/button'
import { Container } from 'src/components/atoms/container'

export default async function Posts() {
  const posts = await prisma.post.findMany()

  return (
    <Container belowNav className="flex flex-col gap-4">
      <AccountHeader title="Posts">
        <Button href="/admin/posts/new">New Post</Button>
      </AccountHeader>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
          </li>
        ))}
      </ul>
      {posts.length === 0 && <div>No posts yet</div>}
    </Container>
  )
}
