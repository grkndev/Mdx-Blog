import { compile } from '@mdx-js/mdx'
import { cache } from 'react'
import { createHash } from 'crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface CachedMDX {
  compiled: string
  hash: string
  timestamp: number
}

const CACHE_DIR = join(process.cwd(), '.mdx-cache')
const CACHE_EXPIRY = 1000 * 60 * 60 * 24 // 24 hours

// Ensure cache directory exists
if (!existsSync(CACHE_DIR)) {
  mkdirSync(CACHE_DIR, { recursive: true })
}

function generateHash(content: string): string {
  return createHash('md5').update(content).digest('hex')
}

function getCacheFilePath(slug: string): string {
  return join(CACHE_DIR, `${slug}.json`)
}

function isValidCache(cached: CachedMDX, currentHash: string): boolean {
  const now = Date.now()
  return (
    cached.hash === currentHash &&
    (now - cached.timestamp) < CACHE_EXPIRY
  )
}

export const compileMDX = cache(async (content: string, slug: string) => {
  const currentHash = generateHash(content)
  const cacheFilePath = getCacheFilePath(slug)

  // Try to load from cache first
  if (existsSync(cacheFilePath)) {
    try {
      const cached: CachedMDX = JSON.parse(readFileSync(cacheFilePath, 'utf8'))
      
      if (isValidCache(cached, currentHash)) {
        return cached.compiled
      }
    } catch (error) {
      console.warn(`Failed to read cache for ${slug}:`, error)
    }
  }

  // Compile MDX
  const compiled = await compile(content, {
    outputFormat: 'function-body',
    development: process.env.NODE_ENV === 'development',
  })

  // Cache the result
  const cacheData: CachedMDX = {
    compiled: String(compiled),
    hash: currentHash,
    timestamp: Date.now()
  }

  try {
    writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2))
  } catch (error) {
    console.warn(`Failed to write cache for ${slug}:`, error)
  }

  return String(compiled)
})

// Cleanup old cache files
export function cleanupCache(): void {
  const now = Date.now()
  
  try {
    const files = require('fs').readdirSync(CACHE_DIR)
    
    files.forEach((file: string) => {
      const filePath = join(CACHE_DIR, file)
      
      try {
        const cached: CachedMDX = JSON.parse(readFileSync(filePath, 'utf8'))
        
        if ((now - cached.timestamp) > CACHE_EXPIRY) {
          require('fs').unlinkSync(filePath)
        }
      } catch (error) {
        // Delete corrupted cache files
        require('fs').unlinkSync(filePath)
      }
    })
  } catch (error) {
    console.warn('Failed to cleanup cache:', error)
  }
} 