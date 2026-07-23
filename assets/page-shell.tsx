import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, RefreshCw, Search, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type PreviewState = 'normal' | 'loading' | 'empty' | 'error' | 'disabled' | 'success'

const prototypeRows = [
  { id: 'P-10021', name: '示例记录 A', owner: '示例用户', status: '正常', createdAt: '2026-07-22 10:30' },
  { id: 'P-10022', name: '示例记录 B', owner: '示例用户', status: '待处理', createdAt: '2026-07-21 16:45' },
]

const previewStates: PreviewState[] = ['normal', 'loading', 'empty', 'error', 'disabled', 'success']

function getInitialPreviewState(): PreviewState {
  if (typeof window === 'undefined') return 'normal'
  const value = new URLSearchParams(window.location.search).get('prototypeState') as PreviewState | null
  return value && previewStates.includes(value) ? value : 'normal'
}

export default function __COMPONENT_NAME__() {
  const [draft, setDraft] = useState({ keyword: '', status: '' })
  const [query, setQuery] = useState(draft)
  const [previewState, setPreviewState] = useState<PreviewState>(getInitialPreviewState)
  const [page, setPage] = useState(1)

  const rows = useMemo(() => prototypeRows.filter((row) => {
    const keyword = query.keyword.trim().toLowerCase()
    const matchesKeyword = !keyword || `${row.id}${row.name}${row.owner}`.toLowerCase().includes(keyword)
    const matchesStatus = !query.status || row.status === query.status
    return matchesKeyword && matchesStatus
  }), [query])

  const reset = () => {
    const empty = { keyword: '', status: '' }
    setDraft(empty)
    setQuery(empty)
    setPage(1)
    setPreviewState('normal')
  }

  const visibleRows = previewState === 'empty' ? [] : rows
  const tableMessage = previewState === 'loading'
    ? '正在加载数据…'
    : previewState === 'error'
      ? '数据加载失败，请重新加载'
      : '暂无符合条件的记录'

  return <main
    data-prototype-page="__PAGE_SLUG__"
    data-state-coverage="loading empty error disabled success"
    className="min-h-screen overflow-x-hidden bg-background text-foreground"
  >
    <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-5 p-4 lg:p-6">
      <header>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Users className="h-4 w-4" />业务工作台</div>
          <h1 className="text-xl font-semibold">__PAGE_TITLE__</h1>
          <p className="mt-1 text-sm text-muted-foreground">查看并处理相关业务数据。</p>
        </div>
      </header>

      {previewState === 'success' ? <div className="flex items-start gap-3 rounded-2xl border bg-card p-4" role="status"><CheckCircle2 className="mt-0.5 h-5 w-5" /><div><div className="text-sm font-semibold">操作已完成</div><div className="mt-1 text-xs text-muted-foreground">操作结果已更新。</div></div></div> : null}

      <Card className="min-w-0">
        <CardHeader><CardTitle>筛选条件</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid min-w-0 gap-1.5"><Label htmlFor="prototype-keyword">关键词</Label><Input id="prototype-keyword" value={draft.keyword} onChange={(event) => setDraft((current) => ({ ...current, keyword: event.target.value }))} placeholder="编号 / 名称 / 用户" disabled={previewState === 'disabled'} /></div>
            <div className="grid min-w-0 gap-1.5"><Label>处理状态</Label><Select value={draft.status || '__all__'} onValueChange={(value) => setDraft((current) => ({ ...current, status: value === '__all__' ? '' : value }))} disabled={previewState === 'disabled'}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="__all__">全部</SelectItem><SelectItem value="正常">正常</SelectItem><SelectItem value="待处理">待处理</SelectItem></SelectGroup></SelectContent></Select></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => { setQuery(draft); setPage(1) }} disabled={previewState === 'disabled'}><Search className="mr-1.5 h-4 w-4" />查询</Button><Button variant="outline" onClick={reset}><RefreshCw className="mr-1.5 h-4 w-4" />重置</Button></div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2"><CardTitle>数据列表</CardTitle><Badge variant="secondary">共 {visibleRows.length} 条</Badge></CardHeader>
        <CardContent className="p-0">
          <Table className="min-w-[860px]">
            <TableHeader><TableRow><TableHead>记录</TableHead><TableHead>负责人</TableHead><TableHead>状态</TableHead><TableHead>创建时间</TableHead><TableHead>操作</TableHead></TableRow></TableHeader>
            <TableBody>
              {previewState === 'loading' || previewState === 'error' || visibleRows.length === 0 ? <TableRow><TableCell colSpan={5} className="h-36 text-center text-muted-foreground"><div className="flex flex-col items-center gap-3">{previewState === 'error' ? <AlertCircle className="h-5 w-5" /> : null}<span>{tableMessage}</span>{previewState === 'error' ? <Button size="sm" variant="outline" onClick={() => setPreviewState('normal')}>重新加载</Button> : null}</div></TableCell></TableRow> : visibleRows.map((row) => <TableRow key={row.id}><TableCell><div className="font-medium">{row.name}</div><div className="mt-0.5 font-mono text-xs text-muted-foreground">{row.id}</div></TableCell><TableCell>{row.owner || '—'}</TableCell><TableCell><Badge variant={row.status === '正常' ? 'default' : 'outline'}>{row.status}</Badge></TableCell><TableCell className="text-xs">{row.createdAt}</TableCell><TableCell><Button size="sm" variant="outline" onClick={() => setPreviewState('success')}>查看详情</Button></TableCell></TableRow>)}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground"><span>第 {page} 页</span><div className="flex gap-2"><Button size="icon" variant="outline" aria-label="上一页" title="上一页" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft className="h-4 w-4" /></Button><Button size="icon" variant="outline" aria-label="下一页" title="下一页" disabled={page >= 2} onClick={() => setPage((value) => Math.min(2, value + 1))}><ChevronRight className="h-4 w-4" /></Button></div></div>
        </CardContent>
      </Card>
    </div>
  </main>
}
