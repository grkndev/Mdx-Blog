'use client'

import { useState } from 'react'
import { BlogCard } from '@/components/blog-card'
import { SearchBar } from '@/components/search-bar'
import { BlogMetadata } from '@/lib/blog'

interface BlogListClientProps {
  posts: BlogMetadata[]
  allTags: string[]
}

export function BlogListClient({ posts, allTags }: BlogListClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogMetadata[]>(posts)

  const handleSearchResults = (results: BlogMetadata[]) => {
    setFilteredPosts(results)
  }

  return (
    <>
      {/* Search */}
      <div className="mb-8">
        <SearchBar 
          posts={posts} 
          onSearchResults={handleSearchResults}
          allTags={allTags}
        />
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {filteredPosts.length} yazı bulundu
          {filteredPosts.length !== posts.length && ` (${posts.length} toplam)`}
        </p>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Aradığınız kriterlere uygun blog yazısı bulunamadı.
          </p>
          <button 
            onClick={() => handleSearchResults(posts)}
            className="text-primary hover:underline"
          >
            Tüm yazıları göster
          </button>
        </div>
      )}
    </>
  )
} 