import fs from 'node:fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'

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

const postsDirectory = path.join(process.cwd(), 'content/posts')

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function createSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, '')
}

export const getAllPosts = cache(async (): Promise<BlogMetadata[]> => {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(name => name.endsWith('.md') || name.endsWith('.mdx'))
    .map(fileName => {
      const slug = createSlugFromFilename(fileName)
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        tags: Array.isArray(data.tags) ? data.tags : [],
        readingTime: calculateReadingTime(content)
      } as BlogMetadata
    })

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
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
})

export const getAllTags = cache(async (): Promise<string[]> => {
  const posts = await getAllPosts()
  const tagSet = new Set<string>()
  
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
})

export const getPostsByTag = cache(async (tag: string): Promise<BlogMetadata[]> => {
  const posts = await getAllPosts()
  return posts.filter(post => post.tags.includes(tag))
}) 