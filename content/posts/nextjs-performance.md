---
title: "Next.js Performance Optimizasyonu"
description: "Next.js uygulamalarında performans optimizasyonu teknikleri ve best practice'ler."
tags: ["nextjs", "performance", "web-development", "react"]
date: "2025-01-12"
---

# Next.js Performance Optimizasyonu

Next.js, React uygulamaları için güçlü performans optimizasyonları sunar. Bu makalede, Next.js uygulamalarınızı nasıl optimize edebileceğinizi öğreneceksiniz.

## Image Optimization

Next.js'in built-in Image component'i kullanın:

```tsx
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

function OptimizedImage({ src, alt, priority = false, className }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      {hasError ? (
        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
          <span>Failed to load image</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  )
}

// Usage in a gallery component
function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <div key={src} className="aspect-square">
          <OptimizedImage
            src={src}
            alt={`Gallery image ${index + 1}`}
            priority={index < 3} // Prioritize first 3 images
            className="w-full h-full rounded-lg"
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGallery
```

## Static Site Generation (SSG)

Statik sayfalarda SSG kullanın:

```tsx
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'

interface Post {
  id: string
  title: string
  content: string
  publishedAt: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
}

interface PostPageProps {
  post: Post
  relatedPosts: Post[]
}

interface PostParams extends ParsedUrlQuery {
  slug: string
}

// Static Site Generation with ISR (Incremental Static Regeneration)
export const getStaticProps: GetStaticProps<PostPageProps, PostParams> = async ({ 
  params 
}) => {
  try {
    const { slug } = params!
    
    // Fetch post data
    const [post, relatedPosts] = await Promise.all([
      fetchPost(slug),
      fetchRelatedPosts(slug, 3)
    ])

    if (!post) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        post,
        relatedPosts,
      },
      // Regenerate page at most once every hour
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    
    return {
      notFound: true,
    }
  }
}

// Generate static paths for popular posts at build time
export const getStaticPaths: GetStaticPaths<PostParams> = async () => {
  // Get most popular posts for pre-generation
  const popularPosts = await fetchPopularPosts(50)
  
  const paths = popularPosts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    // Enable ISR for other posts
    fallback: 'blocking',
  }
}

async function fetchPost(slug: string): Promise<Post | null> {
  const response = await fetch(`${process.env.API_URL}/posts/${slug}`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
  })

  if (!response.ok) return null
  
  return response.json()
}

async function fetchRelatedPosts(slug: string, limit: number): Promise<Post[]> {
  const response = await fetch(
    `${process.env.API_URL}/posts/${slug}/related?limit=${limit}`
  )
  
  if (!response.ok) return []
  
  return response.json()
}

async function fetchPopularPosts(limit: number): Promise<{ slug: string }[]> {
  const response = await fetch(
    `${process.env.API_URL}/posts/popular?limit=${limit}`
  )
  
  if (!response.ok) return []
  
  return response.json()
}

function PostPage({ post, relatedPosts }: PostPageProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm">{new Date(post.publishedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {post.tags.map(tag => (
            <span 
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {relatedPosts.length > 0 && (
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedPosts.map(relatedPost => (
              <a 
                key={relatedPost.id}
                href={`/posts/${relatedPost.id}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(relatedPost.publishedAt).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default PostPage
```

## Dynamic Imports & Code Splitting

Büyük componentler için dynamic import kullanın:

```tsx
import dynamic from 'next/dynamic'
import { useState, Suspense } from 'react'

// Heavy component with loading state
const HeavyChart = dynamic(
  () => import('../components/HeavyChart').then(mod => mod.HeavyChart),
  { 
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading chart...</span>
      </div>
    ),
    ssr: false // Disable SSR for client-only components
  }
)

// Conditional loading based on user interaction
const AdvancedFilters = dynamic(
  () => import('../components/AdvancedFilters'),
  { 
    loading: () => <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
  }
)

// Modal component - only load when needed
const Modal = dynamic(
  () => import('../components/Modal'),
  { ssr: false }
)

interface DashboardProps {
  data: any[]
  user: { 
    id: string
    preferences: {
      showAdvancedFilters: boolean
      chartType: 'simple' | 'advanced'
    }
  }
}

function Dashboard({ data, user }: DashboardProps) {
  const [showModal, setShowModal] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(
    user.preferences.showAdvancedFilters
  )

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export Data
          </button>
        </div>
      </header>

      {showAdvancedFilters && (
        <Suspense fallback={<div>Loading filters...</div>}>
          <AdvancedFilters data={data} />
        </Suspense>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Simple Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Items:</span>
              <span className="font-bold">{data.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users:</span>
              <span className="font-bold">1,234</span>
            </div>
          </div>
        </div>

        {user.preferences.chartType === 'advanced' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
            <HeavyChart data={data} />
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title="Export Data"
          onClose={() => setShowModal(false)}
        >
          <div className="p-4">
            <p>Choose export format:</p>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                CSV
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                JSON
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded">
                PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Dashboard
```

## API Routes Optimization

Optimize edilmiş API routes:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from 'ioredis'
import { rateLimit } from '@/lib/rate-limit'

// Redis client for caching
const redis = new Redis(process.env.REDIS_URL!)

interface PostsQuery {
  page?: string
  limit?: string
  category?: string
  search?: string
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query: PostsQuery = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
    }

    // Validate query parameters
    const page = Math.max(1, parseInt(query.page))
    const limit = Math.min(50, Math.max(1, parseInt(query.limit))) // Max 50 items per page

    // Create cache key
    const cacheKey = `posts:${JSON.stringify(query)}`
    
    // Try to get from cache first
    const cached = await redis.get(cacheKey)
    if (cached) {
      const data = JSON.parse(cached)
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache-Status': 'HIT',
        },
      })
    }

    // Build database query
    const where: any = {}
    if (query.category) {
      where.category = query.category
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // Execute database queries in parallel
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatar: true }
          },
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where })
    ])

    const result = {
      data: posts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
      meta: {
        cached: false,
        timestamp: new Date().toISOString(),
      }
    }

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(result))

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache-Status': 'MISS',
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// POST endpoint with validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { title, content, category } = body
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorId: body.authorId,
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    // Invalidate related caches
    const pattern = 'posts:*'
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }

    return NextResponse.json(post, { status: 201 })

  } catch (error) {
    console.error('POST Error:', error)
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
```

## Bundle Analysis

Bundle boyutunu analiz edin:

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your existing Next.js config
  experimental: {
    optimizeCss: true,
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      }
    }
    
    return config
  },
})

# Run analysis
ANALYZE=true npm run build
```

## Core Web Vitals Monitoring

Web Vitals'ı izleyin:

```tsx
import { useReportWebVitals } from 'next/web-vitals'

export function MyApp({ Component, pageProps }) {
  useReportWebVitals((metric) => {
    // Send to analytics
    if (process.env.NODE_ENV === 'production') {
      sendToAnalytics(metric)
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }
  })

  return <Component {...pageProps} />
}

function sendToAnalytics(metric) {
  const { name, value, id } = metric
  
  // Send to Google Analytics
  gtag('event', name, {
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_category: 'Web Vitals',
    event_label: id,
    non_interaction: true,
  })
  
  // Or send to your own analytics service
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metric: name,
      value,
      id,
      url: window.location.href,
    }),
  })
}
```

## Sonuç

Next.js ile performanslı web uygulamaları geliştirmek için bu teknikleri uygulayın:

- **Image Optimization**: Next.js Image component kullanın
- **SSG/ISR**: Static generation ile hızlı loading
- **Code Splitting**: Dynamic imports ile bundle boyutunu küçültün
- **Caching**: Redis ile API response caching
- **Monitoring**: Web Vitals ile performans takibi

Bu optimizasyonlar sayesinde kullanıcılarınız daha hızlı ve akıcı bir deneyim yaşayacaktır. 