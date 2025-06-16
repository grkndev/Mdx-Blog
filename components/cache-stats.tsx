'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, RefreshCw, HardDrive } from 'lucide-react'

interface CacheStats {
  files: number
  totalSize: number
  stats: Array<{
    file: string
    size: number
    modified: string
  }>
}

export function CacheStats() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/performance?action=cache-stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch cache stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const cleanupCache = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/performance?action=cleanup-cache')
      const result = await response.json()
      
      if (result.success) {
        await fetchStats() // Refresh stats after cleanup
      }
    } catch (error) {
      console.error('Failed to cleanup cache:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      fetchStats()
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          MDX Cache Stats
        </CardTitle>
        <CardDescription>
          Development cache performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cached Files:</span>
              <Badge variant="secondary">{stats.files}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Size:</span>
              <Badge variant="secondary">{formatBytes(stats.totalSize)}</Badge>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={cleanupCache}
            disabled={loading}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Cleanup
          </Button>
        </div>

        {stats && stats.stats.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Cache Files:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {stats.stats.slice(0, 5).map((file, index) => (
                <div key={index} className="text-xs bg-muted p-2 rounded">
                  <div className="font-mono truncate">{file.file}</div>
                  <div className="text-muted-foreground">
                    {formatBytes(file.size)} • {new Date(file.modified).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 