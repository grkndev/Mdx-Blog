import fs from 'node:fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  content: string
  readingTime: number
}

export interface BlogMetadata {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingTime: number
}

interface PostCache {
  metadata: BlogMetadata
  lastModified: number
  fileSize: number
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

// In-memory cache for metadata
const metadataCache = new Map<string, PostCache>()

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function createSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, '')
}

function getFileStats(filePath: string) {
  try {
    const stats = fs.statSync(filePath)
    return {
      lastModified: stats.mtime.getTime(),
      fileSize: stats.size
    }
  } catch {
    return null
  }
}

function isMetadataCacheValid(slug: string, currentStats: { lastModified: number; fileSize: number }): boolean {
  const cached = metadataCache.get(slug)
  if (!cached) return false
  
  return (
    cached.lastModified === currentStats.lastModified &&
    cached.fileSize === currentStats.fileSize
  )
}

// Cache metadata extraction for better performance
const extractMetadata = cache((fileContents: string, slug: string): BlogMetadata => {
  const { data, content } = matter(fileContents)
  
  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTime: calculateReadingTime(content)
  }
})

// Optimized getAllPosts with caching
export const getAllPosts = unstable_cache(
  async (): Promise<BlogMetadata[]> => {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const posts: BlogMetadata[] = []

    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) {
        continue
      }

      const slug = createSlugFromFilename(fileName)
      const fullPath = path.join(postsDirectory, fileName)
      const fileStats = getFileStats(fullPath)

      if (!fileStats) continue

      // Check if we have valid cached metadata
      if (isMetadataCacheValid(slug, fileStats)) {
        const cached = metadataCache.get(slug)!
        posts.push(cached.metadata)
        continue
      }

      // Read and parse file if cache miss
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const metadata = extractMetadata(fileContents, slug)

      // Update cache
      metadataCache.set(slug, {
        metadata,
        lastModified: fileStats.lastModified,
        fileSize: fileStats.fileSize
      })

      posts.push(metadata)
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
  ['blog-posts'],
  {
    revalidate: 300, // Revalidate every 5 minutes
    tags: ['blog-posts']
  }
)

// Optimized getPostBySlug with better caching
export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!fs.existsSync(postsDirectory)) {
      return null
    }

    const possibleFiles = [`${slug}.md`, `${slug}.mdx`]
    
    for (const fileName of possibleFiles) {
      const fullPath = path.join(postsDirectory, fileName)
      
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          tags: Array.isArray(data.tags) ? data.tags : [],
          content,
          readingTime: calculateReadingTime(content)
        }
      }
    }

    return null
  },
  ['blog-post'],
  {
    revalidate: 3600, // Revalidate every hour
    tags: ['blog-post']
  }
)

// Fast metadata-only operations
export const getAllTags = unstable_cache(
  async (): Promise<string[]> => {
    const posts = await getAllPosts()
    const tagSet = new Set<string>()
    
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag))
    })
    
    return Array.from(tagSet).sort()
  },
  ['blog-tags'],
  {
    revalidate: 600, // Revalidate every 10 minutes
    tags: ['blog-tags', 'blog-posts']
  }
)

export const getPostsByTag = cache(async (tag: string): Promise<BlogMetadata[]> => {
  const posts = await getAllPosts()
  return posts.filter(post => post.tags.includes(tag))
})

// Batch operations for better performance
export const getPostsMetadataBatch = cache(async (slugs: string[]): Promise<BlogMetadata[]> => {
  const allPosts = await getAllPosts()
  const slugSet = new Set(slugs)
  
  return allPosts.filter(post => slugSet.has(post.slug))
})

// Cache invalidation helpers
export function invalidatePostsCache() {
  metadataCache.clear()
}

export function invalidatePostCache(slug: string) {
  metadataCache.delete(slug)
}

// Preload popular posts
export const preloadPopularPosts = cache(async (limit: number = 10): Promise<BlogMetadata[]> => {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, limit)
}) 