'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { BlogMetadata } from '@/lib/blog'
import { createSearchIndex } from '@/lib/search'

interface SearchBarProps {
  posts: BlogMetadata[]
  onSearchResults: (results: BlogMetadata[]) => void
  allTags: string[]
}

export function SearchBar({ posts, onSearchResults, allTags }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const searchIndex = useMemo(() => createSearchIndex(posts), [posts])

  const handleSearch = useCallback(() => {
    if (!query.trim() && selectedTags.length === 0) {
      onSearchResults(posts)
      return
    }

    if (query.trim()) {
      const results = searchIndex.search({ query, tags: selectedTags })
      onSearchResults(results)
    } else if (selectedTags.length > 0) {
      const results = searchIndex.searchByTags(selectedTags)
      onSearchResults(results)
    }
  }, [query, selectedTags, searchIndex, posts, onSearchResults])

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearSearch = () => {
    setQuery('')
    setSelectedTags([])
    onSearchResults(posts)
  }

  // Trigger search when query or tags change
  useEffect(() => {
    const timer = setTimeout(handleSearch, 100)
    return () => clearTimeout(timer)
  }, [handleSearch])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Blog yazılarında ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {(query || selectedTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Kategoriler:</p>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Seçili kategoriler:</span>
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleTagClick(tag)}>
              {tag}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 