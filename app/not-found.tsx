import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileX, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <FileX className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-muted-foreground mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Blog yazılarımızı keşfetmek için ana sayfaya dönebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
} 