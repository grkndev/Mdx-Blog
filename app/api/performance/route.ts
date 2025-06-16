import { NextRequest, NextResponse } from 'next/server'
import { cleanupCache } from '@/lib/mdx-cache'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'cleanup-cache':
        cleanupCache()
        return NextResponse.json({ 
          success: true, 
          message: 'Cache cleaned up successfully' 
        })

      case 'cache-stats':
        // Get cache statistics
        const fs = require('fs')
        const path = require('path')
        const cacheDir = path.join(process.cwd(), '.mdx-cache')
        
        if (!fs.existsSync(cacheDir)) {
          return NextResponse.json({
            success: true,
            data: { files: 0, size: 0 }
          })
        }

        const files = fs.readdirSync(cacheDir)
        const stats = files.map((file: string) => {
          const filePath = path.join(cacheDir, file)
          const stat = fs.statSync(filePath)
          return {
            file,
            size: stat.size,
            modified: stat.mtime
          }
        })

        const totalSize = stats.reduce((acc: number, stat: any) => acc + stat.size, 0)

        return NextResponse.json({
          success: true,
          data: {
            files: files.length,
            totalSize,
            stats
          }
        })

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'log-metrics':
        // Log performance metrics to console or analytics service
        console.log('Performance Metrics:', {
          timestamp: new Date().toISOString(),
          ...data
        })
        
        return NextResponse.json({ 
          success: true, 
          message: 'Metrics logged successfully' 
        })

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid type' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Performance API POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 