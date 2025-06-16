import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, MapPinIcon, LinkIcon, UsersIcon, BookOpenIcon, GithubIcon, LinkedinIcon, TwitterIcon, BadgeCheck, Star } from 'lucide-react'
import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@/components/ui/tooltip'

interface UserProfilePageProps {
  params: {
    slug: string
  }
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { slug } = params

  // Mock user data - gerçek uygulamada bu veri API'den gelecek
  const user = {
    name: "Gürkan Çiloğlu",
    username: slug,
    bio: "Full-stack developer, open source enthusiast. Building amazing web applications with React and Node.js. Passionate about clean code and user experience.",
    avatar: "https://github.com/grkndev.png",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=300&fit=crop",
    location: "Istanbul, Turkey",
    website: "https://grkn.dev",
    email: "info@grkn.dev",
    joinDate: "Mart 2021",
    followers: 1234,
    following: 567,
    posts: 89,
    articles: [
      {
        id: 1,
        title: "React 18 ile Server Components kullanımı",
        excerpt: "React 18'in en heyecan verici özelliklerinden biri olan Server Components'ları derinlemesine inceliyoruz...",
        publishedAt: "2024-01-15",
        readTime: "8 dk",
        tags: ["React", "Server Components"]
      },
      {
        id: 2,
        title: "TypeScript ile tip güvenli API'ler geliştirme",
        excerpt: "Modern web uygulamalarında TypeScript kullanarak nasıl daha güvenli ve sürdürülebilir API'ler geliştirebileceğimizi öğrenin...",
        publishedAt: "2024-01-10",
        readTime: "12 dk",
        tags: ["TypeScript", "API"]
      },
      {
        id: 3,
        title: "Next.js 14'te App Router ile performans optimizasyonu",
        excerpt: "Next.js 14'ün App Router özelliğini kullanarak web uygulamalarımızın performansını nasıl optimize edebileceğimizi...",
        publishedAt: "2024-01-05",
        readTime: "15 dk",
        tags: ["Next.js", "Performance"]
      },
      {
        id: 4,
        title: "Modern CSS ile responsive tasarım prensipleri",
        excerpt: "CSS Grid, Flexbox ve container queries kullanarak modern ve responsive web tasarımları oluşturmak için...",
        publishedAt: "2023-12-28",
        readTime: "10 dk",
        tags: ["CSS", "Responsive"]
      }
    ],
    socialLinks: {
      github: "https://github.com/grkndev",
      linkedin: "https://linkedin.com/in/grkndev",
      twitter: "https://twitter.com/grkndev"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="h-48 md:h-64 relative overflow-hidden">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative">
        {/* Profile Header */}
        <Card className="border-2">
          <CardContent >
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div>

                  <div className='flex flex-row items-center gap-2'>
                    <h1 className="text-3xl font-bold">{user.name}</h1>

                    <div className='flex flex-row gap-1'>
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeCheck className='w-6 h-6 fill-blue-500 text-white' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Doğrulanmış Üye</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Star className='w-6 h-6 fill-yellow-500 text-white' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Modern Blog Star</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                {/* <p className="text-foreground max-w-2xl">{user.bio}</p> */}

                <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                  <div className='flex flex-col md:flex-row gap-2 items-start justify-center'>
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{user.joinDate} tarihinden beri üye</span>
                    </div>
                  </div>
                  <div className='flex flex-row gap-4 items-center justify-center'>
                    <div className="flex items-center justify-center  gap-1">
                      <LinkIcon className="w-4 h-4" />
                      <a href={user.website} className="text-primary hover:underline">
                        {user.website}
                      </a>
                    </div>
                    {/* Social Media Icons */}
                    <div className="flex items-center gap-2 ">
                      <a href={user.socialLinks.github} className="text-muted-foreground hover:text-primary transition-colors">
                        <GithubIcon className="w-4 h-4" />
                      </a>
                      <a href={user.socialLinks.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                      <a href={user.socialLinks.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                        <TwitterIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>



                {/* Stats in Profile */}
                <div className="flex gap-6 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{user.posts}</span>
                    <span className="text-muted-foreground">gönderi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{user.followers.toLocaleString()}</span>
                    <span className="text-muted-foreground">takipçi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{user.following.toLocaleString()}</span>
                    <span className="text-muted-foreground">takip</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <LinkIcon className="w-4 h-4 mr-1" />
                  İletişim
                </Button>
                <Button size="sm">
                  Takip Et
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles */}
        <div className="mt-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Makaleler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
