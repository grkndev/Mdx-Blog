import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoadingBar } from "@/components/loading-bar";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog | Modern MDX Blog",
  description: "Yazılım geliştirme, teknoloji ve programlama hakkında modern blog yazıları",
  keywords: ["blog", "yazılım", "teknoloji", "programlama", "web development"],
  authors: [{ name: "Blog Author" }],
  creator: "Blog Author",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "Modern MDX Blog",
    description: "Yazılım geliştirme, teknoloji ve programlama hakkında modern blog yazıları",
    siteName: "Modern Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern MDX Blog",
    description: "Yazılım geliştirme, teknoloji ve programlama hakkında modern blog yazıları",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LoadingBar />
          <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl hover:text-primary transition-colors">
                  Modern Blog
                </Link>
                <nav className="flex items-center gap-6">
                  <Link 
                    href="/" 
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Ana Sayfa
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/50">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center text-sm text-muted-foreground">
                  <p>&copy; 2025 Modern Blog. Tüm hakları saklıdır.</p>
                  <p className="mt-2">
                    Next.js ve Shadcn UI ile ❤️ ile yapılmıştır.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
