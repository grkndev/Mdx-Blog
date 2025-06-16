import { BlogListClient } from '@/components/blog-list-client'
import { getAllPosts, getAllTags } from '@/lib/blog-optimized'

export default async function HomePage() {
  const [posts, allTags] = await Promise.all([
    getAllPosts(),
    getAllTags()
  ])

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Yazılım geliştirme, teknoloji ve programlama hakkında yazılar
        </p>
      </div>

      {/* Blog List with Client-side functionality */}
      <BlogListClient posts={posts} allTags={allTags} />
    </div>
  )
}
