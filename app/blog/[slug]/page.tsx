import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ArrowLeft, BadgeCheck, Calendar, Clock, Star, Tag, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getPostBySlug, getAllPosts } from '@/lib/blog-optimized'
import { MDXContentOptimized } from '@/components/mdx-content-optimized'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Tüm yazılara dön
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">

            <div className='flex items-center gap-1'>
              <UserRound className='h-4 w-4' />
              <span>Yazar:</span>
            </div>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Link href="/users/grkndev" className='flex items-center gap-1'>
                  {/* <Button variant={"link"} > */}
                  <Avatar className='w-6 h-6'>
                    <AvatarImage src="https://github.com/grkndev.png" />
                    <AvatarFallback>GD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold ">GrknDev</span>
                  {/* </Button> */}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/grkndev.png" />
                    <AvatarFallback>GD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className='flex flex-row gap-1'>
                      <h4 className="text-sm font-semibold">Gürkan Çiloğlu</h4>
                      <div className='flex flex-row '>
                        <Tooltip>
                          <TooltipTrigger>
                            <BadgeCheck className='w-4 h-4 fill-blue-500 text-white' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Doğrulanmış Üye</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Star className='w-4 h-4 fill-yellow-500 text-white' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modern Blog Star</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <h4 className="text-xs font-semibold text-muted-foreground">@grkndev</h4>
                    <p className="text-sm">
                      Full time developer, part time human.
                    </p>
                    <div className="text-muted-foreground text-xs">
                      381 followers
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {format(new Date(post.date), 'dd MMMM yyyy', { locale: tr })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} dakika okuma</span>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-8">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="mb-8" />
        </header>

        {/* Article Content */}
        <MDXContentOptimized source={post.content} />
      </article>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground">Yazar</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href="/users/grkndev" className='flex items-center gap-2'>
                {/* <Button variant={"link"} > */}
                <Avatar>
                  <AvatarImage src="https://github.com/grkndev.png" />
                  <AvatarFallback>GD</AvatarFallback>
                </Avatar>
                <span className="text-lg font-bold underline-offset-4 underline">GrknDev</span>
                {/* </Button> */}
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/grkndev.png" />
                  <AvatarFallback>GD</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@grkndev</h4>
                  <p className="text-sm">
                    Full time developer, part time human.
                  </p>
                  <div className="text-muted-foreground text-xs">
                    381 followers
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>


        </div>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Diğer yazıları gör
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  )
} 