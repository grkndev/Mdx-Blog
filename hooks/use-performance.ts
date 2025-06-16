'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  timeToFirstByte: number
  timeToInteractive: number
  cumilativeLayoutShift: number
  firstContentfulPaint: number
  largestContentfulPaint: number
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const measurePerformance = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paintEntries = performance.getEntriesByType('paint')
        
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0]

        setMetrics({
          loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          renderTime: navigation?.domComplete - navigation?.domContentLoadedEventStart || 0,
          timeToFirstByte: navigation?.responseStart - navigation?.requestStart || 0,
          timeToInteractive: navigation?.domInteractive - navigation?.domContentLoadedEventStart || 0,
          firstContentfulPaint: fcp?.startTime || 0,
          largestContentfulPaint: lcp?.startTime || 0,
        })

        setIsLoading(false)
      } catch (error) {
        console.warn('Performance measurement failed:', error)
        setIsLoading(false)
      }
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
    }
  }, [])

  return { metrics, isLoading }
}

export function useRenderTimer(componentName: string) {
  const [renderTime, setRenderTime] = useState<number>(0)

  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      setRenderTime(duration)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${duration.toFixed(2)}ms`)
      }
    }
  }, [componentName])

  return renderTime
}

export function logPerformanceMetrics(pageName: string, customMetrics?: Record<string, number>) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    console.group(`🚀 Performance Metrics for ${pageName}`)
    console.log('Load Time:', navigation?.loadEventEnd - navigation?.loadEventStart, 'ms')
    console.log('TTFB:', navigation?.responseStart - navigation?.requestStart, 'ms')
    console.log('DOM Complete:', navigation?.domComplete - navigation?.domContentLoadedEventStart, 'ms')
    
    if (customMetrics) {
      console.log('Custom Metrics:', customMetrics)
    }
    
    console.groupEnd()
  } catch (error) {
    console.warn('Failed to log performance metrics:', error)
  }
} 