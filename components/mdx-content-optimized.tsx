import { Suspense, memo } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { CodeBlock } from '@/components/code-block'
import TableWrapper from '@/components/table-wrapper'

// Optimized components with better performance
const components = {
  h1: memo((props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold mb-6 text-foreground scroll-mt-8" {...props} />
  )),
  h2: memo((props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-semibold mb-4 mt-8 text-foreground scroll-mt-8" {...props} />
  )),
  h3: memo((props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-semibold mb-3 mt-6 text-foreground scroll-mt-8" {...props} />
  )),
  h4: memo((props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-xl font-semibold mb-2 mt-4 text-foreground scroll-mt-8" {...props} />
  )),
  p: memo((props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7 text-muted-foreground" {...props} />
  )),
  ul: memo((props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground" {...props} />
  )),
  ol: memo((props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground" {...props} />
  )),
  li: memo((props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  )),
  blockquote: memo((props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-border pl-4 italic mb-4 text-muted-foreground" {...props} />
  )),
  code: memo((props: any) => {
    if (props.className) {
      const language = props.className.replace('language-', '')
      const code = props.children
      
      return (
        <Suspense fallback={<div className="bg-muted animate-pulse rounded-lg h-24" />}>
          <CodeBlock
            code={code}
            language={language}
            showLineNumbers={true}
          />
        </Suspense>
      )
    }
    return <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props} />
  }),
  pre: memo((props: any) => props.children),
  a: memo((props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded" {...props} />
  )),
  img: memo((props: React.HTMLAttributes<HTMLImageElement>) => (
    <img 
      className="rounded-lg mb-4 max-w-full h-auto" 
      loading="lazy"
      {...props} 
    />
  )),
  hr: memo((props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  )),
  table: memo((props: React.HTMLAttributes<HTMLTableElement>) => (
    <Suspense fallback={<div className="bg-muted animate-pulse rounded-lg h-32" />}>
      <TableWrapper {...props} />
    </Suspense>
  )),
  th: memo((props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props} />
  )),
  td: memo((props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-4 py-2" {...props} />
  )),
}

interface MDXContentOptimizedProps {
  source: string
}

function MDXContentInner({ source }: MDXContentOptimizedProps) {
  return <MDXRemote source={source} components={components} />
}

const MDXContentMemoized = memo(MDXContentInner)

export function MDXContentOptimized({ source }: MDXContentOptimizedProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <Suspense 
        fallback={
          <div className="space-y-4">
            <div className="bg-muted animate-pulse rounded-lg h-8 w-3/4" />
            <div className="bg-muted animate-pulse rounded-lg h-4 w-full" />
            <div className="bg-muted animate-pulse rounded-lg h-4 w-5/6" />
            <div className="bg-muted animate-pulse rounded-lg h-4 w-4/5" />
          </div>
        }
      >
        <MDXContentMemoized source={source} />
      </Suspense>
    </div>
  )
}

export default MDXContentOptimized 