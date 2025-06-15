'use client'

import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CodeBlockProps {
    code: string
    language: string
    filename?: string
    showLineNumbers?: boolean
}

const languageIcons: Record<string, string> = {
    javascript: '🟨',
    typescript: '🔷',
    tsx: '⚛️',
    jsx: '⚛️',
    python: '🐍',
    css: '🎨',
    html: '🌐',
    json: '📄',
    sql: '🗃️',
    bash: '💻',
    shell: '💻',
    markdown: '📝',
    default: '📝'
}

const getLanguageIcon = (language: string): string => {
    return languageIcons[language.toLowerCase()] || languageIcons.default
}

// Map common language aliases
const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    md: 'markdown'
}

const getMappedLanguage = (language: string): string => {
    const lang = language.toLowerCase()
    return languageMap[lang] || lang
}

export function CodeBlock({ code, language, filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const languageIcon = getLanguageIcon(language)

  return (
    <div className="bg-muted border border-border rounded-lg overflow-hidden my-6">
      <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{languageIcon}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {filename || language}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={copyToClipboard}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md"
                aria-label="Copy code to clipboard"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy code'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto">
        <pre className="text-sm leading-relaxed font-mono text-foreground">
          {code.split('\n').map((line, index) => (
            <div key={index} className="block min-h-[1.5rem]">
              {showLineNumbers && (
                <span className="inline-block w-8 text-right mr-4 text-muted-foreground select-none">
                  {index + 1}
                </span>
              )}
              <span>{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
} 