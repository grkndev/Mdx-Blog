import { CodeBlock } from './code-block'

export function DemoCodeExamples() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">TypeScript React Component</h2>
        <CodeBlock
          language="tsx"
          filename="components/Button.tsx"
          code={`import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'ring-offset-background transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'border border-input bg-background hover:bg-accent': variant === 'outline',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, type ButtonProps }`}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Next.js API Route</h2>
        <CodeBlock
          language="typescript"
          filename="app/api/posts/route.ts"
          code={`import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getPostsByTag } from '@/lib/blog'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    
    let posts
    
    if (tag) {
      posts = await getPostsByTag(tag)
    } else {
      posts = await getAllPosts()
    }
    
    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length
    })
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts' 
      },
      { status: 500 }
    )
  }
}`}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Python Data Processing</h2>
        <CodeBlock
          language="python"
          filename="data_processor.py"
          code={`import pandas as pd
import numpy as np
from typing import List, Dict, Optional

class BlogAnalytics:
    def __init__(self, posts_data: List[Dict]):
        self.df = pd.DataFrame(posts_data)
        self.df['date'] = pd.to_datetime(self.df['date'])
        
    def get_popular_tags(self, limit: int = 10) -> List[str]:
        """Get most popular tags across all posts"""
        all_tags = []
        
        for tags in self.df['tags']:
            if isinstance(tags, list):
                all_tags.extend(tags)
        
        tag_counts = pd.Series(all_tags).value_counts()
        return tag_counts.head(limit).index.tolist()
    
    def get_monthly_post_count(self) -> Dict[str, int]:
        """Get post count by month"""
        monthly_counts = self.df.groupby(
            self.df['date'].dt.to_period('M')
        ).size()
        
        return {
            str(period): count 
            for period, count in monthly_counts.items()
        }
    
    def calculate_reading_time_stats(self) -> Dict[str, float]:
        """Calculate reading time statistics"""
        reading_times = self.df['reading_time']
        
        return {
            'mean': reading_times.mean(),
            'median': reading_times.median(),
            'std': reading_times.std(),
            'min': reading_times.min(),
            'max': reading_times.max()
        }`}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">SQL Database Query</h2>
        <CodeBlock
          language="sql"
          filename="blog_analytics.sql"
          code={`-- Get top 10 most popular blog posts with engagement metrics
WITH post_stats AS (
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.published_at,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT l.id) as like_count,
    COUNT(DISTINCT v.id) as view_count,
    AVG(r.rating) as avg_rating
  FROM posts p
  LEFT JOIN comments c ON p.id = c.post_id AND c.status = 'approved'
  LEFT JOIN likes l ON p.id = l.post_id
  LEFT JOIN views v ON p.id = v.post_id
  LEFT JOIN ratings r ON p.id = r.post_id
  WHERE p.status = 'published'
    AND p.published_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY p.id, p.title, p.slug, p.published_at
),
engagement_score AS (
  SELECT *,
    (view_count * 0.1 + comment_count * 0.5 + like_count * 0.3 + COALESCE(avg_rating, 0) * 0.1) AS score
  FROM post_stats
)
SELECT 
  title,
  slug,
  published_at,
  view_count,
  comment_count,
  like_count,
  ROUND(avg_rating, 2) as avg_rating,
  ROUND(score, 2) as engagement_score
FROM engagement_score
ORDER BY score DESC
LIMIT 10;`}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Bash Deployment Script</h2>
        <CodeBlock
          language="bash"
          filename="deploy.sh"
          code={`#!/bin/bash

# Blog deployment script
set -e

echo "🚀 Starting blog deployment..."

# Configuration
PROJECT_NAME="modern-blog"
BUILD_DIR="./build"
DEPLOY_DIR="/var/www/blog"
BACKUP_DIR="/var/backups/blog"

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Functions
log_info() {
    echo -e "\${GREEN}[INFO]\${NC} $1"
}

log_warn() {
    echo -e "\${YELLOW}[WARN]\${NC} $1"
}

log_error() {
    echo -e "\${RED}[ERROR]\${NC} $1"
}

# Create backup
create_backup() {
    log_info "Creating backup..."
    if [ -d "$DEPLOY_DIR" ]; then
        timestamp=$(date +%Y%m%d_%H%M%S)
        tar -czf "$BACKUP_DIR/backup_$timestamp.tar.gz" -C "$DEPLOY_DIR" .
        log_info "Backup created: backup_$timestamp.tar.gz"
    fi
}

# Build the application
build_app() {
    log_info "Building application..."
    npm ci
    npm run build
    
    if [ $? -eq 0 ]; then
        log_info "Build successful!"
    else
        log_error "Build failed!"
        exit 1
    fi
}

# Deploy the application
deploy_app() {
    log_info "Deploying application..."
    
    # Create deployment directory if it doesn't exist
    mkdir -p "$DEPLOY_DIR"
    
    # Copy build files
    cp -r "$BUILD_DIR"/* "$DEPLOY_DIR/"
    
    # Set permissions
    chown -R www-data:www-data "$DEPLOY_DIR"
    chmod -R 755 "$DEPLOY_DIR"
    
    log_info "Deployment complete!"
}

# Main execution
main() {
    create_backup
    build_app
    deploy_app
    
    log_info "✅ Blog deployment completed successfully!"
    log_info "🌐 Your blog is now live!"
}

# Run main function
main "$@"`}
        />
      </div>
    </div>
  )
} 