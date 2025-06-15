import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import { CodeBlock } from '@/components/code-block'

// Custom components for MDX
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    React.createElement('h1', { className: "text-4xl font-bold mb-6 text-foreground", ...props })
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    React.createElement('h2', { className: "text-3xl font-semibold mb-4 mt-8 text-foreground", ...props })
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    React.createElement('h3', { className: "text-2xl font-semibold mb-3 mt-6 text-foreground", ...props })
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    React.createElement('h4', { className: "text-xl font-semibold mb-2 mt-4 text-foreground", ...props })
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    React.createElement('p', { className: "mb-4 leading-7 text-muted-foreground", ...props })
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    React.createElement('ul', { className: "list-disc list-inside mb-4 space-y-2 text-muted-foreground", ...props })
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    React.createElement('ol', { className: "list-decimal list-inside mb-4 space-y-2 text-muted-foreground", ...props })
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    React.createElement('li', { className: "leading-7", ...props })
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    React.createElement('blockquote', { className: "border-l-4 border-border pl-4 italic mb-4 text-muted-foreground", ...props })
  ),
  code: (props: any) => {
    if (props.className) {
      // This is a code block
      const language = props.className.replace('language-', '')
      const code = props.children
      
      return React.createElement(CodeBlock, {
        code: code,
        language: language,
        showLineNumbers: true
      })
    }
    // This is inline code
    return React.createElement('code', { className: "bg-muted px-2 py-1 rounded text-sm font-mono", ...props })
  },
  pre: (props: any) => props.children, // Let the code component handle styling
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    React.createElement('a', { className: "text-primary hover:underline", ...props })
  ),
  img: (props: React.HTMLAttributes<HTMLImageElement>) => (
    React.createElement('img', { className: "rounded-lg mb-4 max-w-full h-auto", ...props })
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    React.createElement('hr', { className: "my-8 border-border", ...props })
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    React.createElement('div', { className: "overflow-x-auto mb-4" },
      React.createElement('table', { className: "min-w-full border-collapse border border-border", ...props })
    )
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    React.createElement('th', { className: "border border-border px-4 py-2 bg-muted font-semibold text-left", ...props })
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    React.createElement('td', { className: "border border-border px-4 py-2", ...props })
  ),
}

export interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  return React.createElement(MDXRemote, { source, components })
} 