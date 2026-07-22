import { createRoot } from 'react-dom/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import '@/index.css'

function RuntimeReady() {
  return <main className="min-h-screen bg-background p-6 text-foreground">
    <Card className="mx-auto max-w-xl">
      <CardHeader><CardTitle>后台原型运行时已就绪</CardTitle></CardHeader>
      <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
        <Badge>标准组件</Badge>
        <span>请使用 Skill 生成具体原型页。</span>
      </CardContent>
    </Card>
  </main>
}

createRoot(document.getElementById('root')!).render(<RuntimeReady />)
