'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  [key: string]: any
}

// Optimized theme context
interface OptimizedThemeContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  mounted: boolean
}

const OptimizedThemeContext = createContext<OptimizedThemeContextType | undefined>(undefined)

export function useOptimizedTheme() {
  const context = useContext(OptimizedThemeContext)
  if (!context) {
    throw new Error('useOptimizedTheme must be used within ThemeProvider')
  }
  return context
}

function OptimizedThemeWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string>('light')

  useEffect(() => {
    setMounted(true)
    // Get initial theme from localStorage or default to light
    const savedTheme = localStorage.getItem('md-blog-theme') || 'light'
    setCurrentTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  const setTheme = (theme: string) => {
    setCurrentTheme(theme)
    localStorage.setItem('md-blog-theme', theme)
    document.documentElement.className = theme
  }

  return (
    <OptimizedThemeContext.Provider value={{ theme: currentTheme, setTheme, mounted }}>
      {children}
    </OptimizedThemeContext.Provider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={true}
      storageKey="md-blog-theme"
      forcedTheme={undefined}
      {...props}
    >
      <OptimizedThemeWrapper>
        {children}
      </OptimizedThemeWrapper>
    </NextThemesProvider>
  )
} 