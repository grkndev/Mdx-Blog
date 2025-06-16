/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable static export optimization
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    
    // Enable partial prerendering (PPR) - Next.js 14+ feature
    ppr: true,
    
    // Enable concurrent features
    turbo: {
      rules: {
        '*.md': {
          loaders: ['@mdx-js/loader'],
          as: '*.mdx',
        },
        '*.mdx': {
          loaders: ['@mdx-js/loader'],
        },
      },
    },
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Images configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enable tree shaking for better bundle size
    config.optimization.usedExports = true
    config.optimization.sideEffects = false
    
    // Better module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    }
    
    // MDX file handling
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: {
            providerImportSource: '@mdx-js/react',
          },
        },
      ],
    })
    
    // Bundle analyzer (only in production build)
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analyzer.html',
        })
      )
    }
    
    return config
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/content/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ]
  },
  
  // Compression
  compress: true,
  
  // Output optimization
  output: 'standalone',
  
  // Power pack features
  poweredByHeader: false,
  
  // Static optimization
  trailingSlash: false,
  
  // Enable SWC minifier
  swcMinify: true,
}

module.exports = nextConfig 