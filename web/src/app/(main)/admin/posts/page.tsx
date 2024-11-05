import prisma from '@books-about-food/database'
import Link from 'next/link'
import { AccountHeader } from 'src/components/accounts/header'
import { Button } from 'src/components/atoms/button'

export default async function Posts() {
  const posts = await prisma.post.findMany()

  return (
    <div className="flex flex-col gap-4">
      <AccountHeader title="Posts">
        <Button href="/admin/posts/new">New Post</Button>
      </AccountHeader>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/admin/posts/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
      {posts.length === 0 && <div>No posts yet</div>}
    </div>
  )
}
