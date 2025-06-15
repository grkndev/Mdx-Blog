import Fuse from 'fuse.js'
import { BlogMetadata } from './blog'

export interface SearchOptions {
  query: string
  tags?: string[]
  limit?: number
}

export class BlogSearch {
  private fuse: Fuse<BlogMetadata>
  private posts: BlogMetadata[]

  constructor(posts: BlogMetadata[]) {
    this.posts = posts
    this.fuse = new Fuse(posts, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.3 },
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
    })
  }

  search({ query, tags, limit = 10 }: SearchOptions): BlogMetadata[] {
    let results = this.fuse.search(query)

    if (tags && tags.length > 0) {
      results = results.filter(result => 
        tags.some(tag => result.item.tags.includes(tag))
      )
    }

    return results
      .slice(0, limit)
      .map(result => result.item)
  }

  searchByTags(tags: string[]): BlogMetadata[] {
    return this.posts.filter((post: BlogMetadata) =>
      tags.some(tag => post.tags.includes(tag))
    )
  }
}

export function createSearchIndex(posts: BlogMetadata[]): BlogSearch {
  return new BlogSearch(posts)
} 