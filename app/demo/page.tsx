import { DemoCodeExamples } from '@/components/demo-code-examples'

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Code Block Demo</h1>
        <p className="text-xl text-muted-foreground">
          Gelişmiş kod bloku component'inin örnekleri
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Satır numaraları, syntax highlighting, copy button ve dil ikonları ile
        </p>
      </div>
      
      <DemoCodeExamples />
    </div>
  )
} 