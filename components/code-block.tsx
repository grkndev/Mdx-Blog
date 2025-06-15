'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Check, Copy } from 'lucide-react'
import { highlight, languages } from 'prismjs'

// Import required language grammars
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-sql'

interface CodeBlockProps {
    code: string
    language: string
    filename?: string
    showLineNumbers?: boolean
}

const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    py: 'python',
    sh: 'bash',
    bash: 'bash',
    json: 'json',
    css: 'css',
    sql: 'sql',
}

const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
            return '🟨'
        case 'typescript':
        case 'ts':
            return '🔷'
        case 'python':
        case 'py':
            return '🐍'
        case 'bash':
        case 'sh':
            return '💻'
        case 'json':
            return '📄'
        case 'css':
            return '🎨'
        case 'html':
            return '🌐'
        default:
            return '📝'
    }
}

export function CodeBlock({
    code,
    language,
    filename,
    showLineNumbers = true
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    const normalizedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase()
    const grammar = languages[normalizedLanguage]

    const highlightedCode = grammar
        ? highlight(code, grammar, normalizedLanguage)
        : code

    const lines = code.split('\n')
    const maxLineNumber = lines.length
    const lineNumberWidth = Math.max(2, maxLineNumber.toString().length)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy code:', err)
        }
    }

    return (
        <div className="group relative rounded-lg border bg-muted/50 overflow-hidden my-6">
            {/* Header */}
            <div className="absolute right-4 top-4 bg-muted border rounded-lg">

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyToClipboard}
                                className="h-8 w-8 p-0 "
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{copied ? 'Kopyalandı!' : 'Kopyala'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

            {/* Code Content */}
            <div className="overflow-auto max-h-96">
                <div className="flex p-4 gap-4">
                    {/* Line Numbers */}
                    {showLineNumbers && (
                        <div className="flex-shrink-0  text-right bg-muted/30 ">
                            <div className="text-xs text-muted-foreground/60 font-mono leading-6">
                                {lines.map((_, index) => (
                                    <div key={index + 1} className="h-6">
                                        {(index + 1).toString().padStart(lineNumberWidth, ' ')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Code */}
                    <div className="flex-1 border-none">
                        <pre className="text-sm font-mono leading-6 overflow-visible border-none ">
                            <code
                                className={`language-${normalizedLanguage}`}
                                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                            />
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
} 