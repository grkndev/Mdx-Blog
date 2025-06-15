---
title: "Tailwind CSS Tips ve Tricks"
description: "Tailwind CSS ile daha verimli ve profesyonel CSS yazma teknikleri."
tags: ["tailwind", "css", "frontend", "design"]
date: "2025-01-08"
---

# Tailwind CSS Tips ve Tricks

Tailwind CSS ile daha verimli ve profesyonel CSS yazma teknikleri ve advanced kullanım örnekleri.

## Custom Component Patterns

Reusable component patterns ile consistent design:

```tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button component with variants
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
      state: {
        default: "",
        loading: "cursor-not-allowed",
        success: "bg-green-500 hover:bg-green-600",
        error: "bg-red-500 hover:bg-red-600",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, state, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const currentState = loading ? "loading" : state;
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, state: currentState, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

// Usage examples
function ButtonExamples() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="gradient">Gradient</Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button loading>Loading</Button>
        <Button state="success">Success</Button>
        <Button state="error">Error</Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button leftIcon={<span>📧</span>}>Send Email</Button>
        <Button rightIcon={<span>→</span>}>Continue</Button>
        <Button 
          leftIcon={<span>⬇</span>} 
          rightIcon={<span>📁</span>}
        >
          Download File
        </Button>
      </div>
    </div>
  );
}

export { Button, buttonVariants, ButtonExamples };
```

## Advanced Layout Patterns

Modern layout teknikleri:

```tsx
import React from 'react';

// Responsive Grid Layout
function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {children}
    </div>
  );
}

// Masonry Layout (CSS Grid version)
function MasonryLayout({ items }: { items: Array<{ id: string; content: React.ReactNode; height?: 'short' | 'medium' | 'tall' }> }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 lg:gap-6 space-y-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className={`break-inside-avoid bg-white rounded-lg shadow-sm border p-4 ${
            item.height === 'short' ? 'h-32' : 
            item.height === 'tall' ? 'h-64' : 'h-48'
          }`}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

// Bento Box Layout
function BentoLayout() {
  return (
    <div className="grid grid-cols-12 grid-rows-8 gap-4 h-screen p-4">
      {/* Hero Section */}
      <div className="col-span-12 md:col-span-8 row-span-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white flex flex-col justify-end">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Our Platform</h1>
        <p className="text-blue-100 text-lg">Discover amazing features and boost your productivity</p>
      </div>
      
      {/* Stats Card */}
      <div className="col-span-12 md:col-span-4 row-span-2 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Users</span>
            <span className="font-bold text-green-600">+12.5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Revenue</span>
            <span className="font-bold text-blue-600">+8.2%</span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="col-span-12 md:col-span-4 row-span-2 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
            Create
          </button>
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
            Upload
          </button>
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
            Share
          </button>
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
            Export
          </button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="col-span-12 row-span-4 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{item}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Activity {item}</p>
                <p className="text-xs text-gray-500">{item} hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ResponsiveGrid, MasonryLayout, BentoLayout };
```

## Custom Animations & Transitions

Smooth animations ve micro-interactions:

```tsx
import React, { useState } from 'react';

// Staggered Animation Container
function StaggeredList({ items }: { items: string[] }) {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item}
          className={`
            transform transition-all duration-500 ease-out
            ${isVisible 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-8 opacity-0'
            }
          `}
          style={{ 
            transitionDelay: `${index * 100}ms` 
          }}
        >
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {item}
          </div>
        </div>
      ))}
    </div>
  );
}

// Morphing Card Component
function MorphingCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-sm mx-auto">
      <div 
        className={`
          bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer
          transform transition-all duration-300 ease-in-out
          ${isExpanded ? 'scale-105 shadow-2xl' : 'hover:scale-102'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400" 
            alt="Nature"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold">Beautiful Nature</h3>
            <p className="text-sm opacity-90">Stunning landscape photography</p>
          </div>
        </div>
        
        <div className={`
          p-6 transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-96' : 'max-h-0 overflow-hidden'}
        `}>
          <p className="text-gray-600 mb-4">
            Discover the beauty of untouched landscapes and experience nature like never before. 
            This stunning location offers breathtaking views and peaceful surroundings.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">$299</span>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Book Now
            </button>
          </div>
        </div>
        
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center">
            <div className={`
              transform transition-transform duration-300
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Action Button with Menu
function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: '📝', label: 'Write', color: 'bg-blue-500' },
    { icon: '📷', label: 'Photo', color: 'bg-green-500' },
    { icon: '🎵', label: 'Music', color: 'bg-purple-500' },
    { icon: '🎥', label: 'Video', color: 'bg-red-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6">
      {/* Menu Items */}
      <div className="flex flex-col-reverse items-center space-y-reverse space-y-3 mb-3">
        {menuItems.map((item, index) => (
          <div
            key={item.label}
            className={`
              transform transition-all duration-300 ease-out
              ${isOpen 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-4 opacity-0 scale-50'
              }
            `}
            style={{ 
              transitionDelay: isOpen ? `${index * 50}ms` : `${(menuItems.length - index) * 50}ms` 
            }}
          >
            <button
              className={`
                ${item.color} text-white w-12 h-12 rounded-full shadow-lg
                hover:scale-110 transition-transform duration-200
                flex items-center justify-center
              `}
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg
          flex items-center justify-center transition-all duration-300
          ${isOpen ? 'rotate-45 scale-110' : 'rotate-0 scale-100'}
        `}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

export { StaggeredList, MorphingCard, FloatingActionMenu };
```

## Dark Mode Implementation

Professional dark mode sistemi:

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);

    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setResolvedTheme(theme);
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {(['light', 'dark', 'system'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${theme === t 
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }
          `}
        >
          {t === 'light' && '☀️'}
          {t === 'dark' && '🌙'}
          {t === 'system' && '💻'}
          <span className="ml-1 capitalize">{t}</span>
        </button>
      ))}
    </div>
  );
}

// Dark Mode Aware Component
function DarkModeCard() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Theme Aware Card
            </h3>
            <div className={`
              w-3 h-3 rounded-full
              ${resolvedTheme === 'dark' 
                ? 'bg-purple-500' 
                : 'bg-yellow-500'
              }
            `} />
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This card automatically adapts to your preferred color scheme. 
            The colors, shadows, and borders all change seamlessly.
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">Current theme:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                {resolvedTheme}
              </span>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                Primary Action
              </button>
              <button className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg transition-colors">
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ThemeProvider, useTheme, ThemeToggle, DarkModeCard };
```

## CSS Configuration

Tailwind CSS konfigürasyonu ve custom theme:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
              },
            },
            'h1, h2, h3, h4': {
              color: 'hsl(var(--foreground))',
            },
            code: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted))',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))',
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--border))',
              color: 'hsl(var(--muted-foreground))',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
};

export default config;
```

## Performance Tips

1. **PurgeCSS**: Kullanılmayan CSS'i temizleyin
2. **JIT Mode**: Just-in-Time compilation kullanın
3. **Component Classes**: Tekrar eden class'ları component'lere çevirin
4. **Custom Properties**: CSS variables ile dynamic theming
5. **Build Optimization**: Production build'de CSS minification

## Best Practices

1. **Consistency**: Design system'e uygun spacing ve colors kullanın
2. **Responsiveness**: Mobile-first yaklaşımla responsive tasarım
3. **Accessibility**: Screen reader ve keyboard navigation desteği
4. **Dark Mode**: Otomatik dark mode desteği
5. **Performance**: Minimal CSS bundle size için optimize edin

Bu teknikler ile Tailwind CSS'in tam potansiyelinden yararlanabilir ve modern, performanslı web arayüzleri oluşturabilirsiniz. 