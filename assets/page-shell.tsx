import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, RefreshCw, Search, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type PreviewState = 'normal' | 'loading' | 'empty' | 'error' | 'disabled' | 'success'

const prototypeRows = [
  { id: 'P-10021', name: '示例记录 A', owner: '示例用户', category: '类型 A', status: '正常', createdAt: '2026-07-22 10:30' },
  { id: 'P-10022', name: '示例记录 B', owner: '示例用户', category: '类型 B', status: '待处理', createdAt: '2026-07-21 16:45' },
]

const previewStates: PreviewState[] = ['normal', 'loading', 'empty', 'error', 'disabled', 'success']
const statusTabs = [
  { value: '__all__', label: '全部' },
  { value: '正常', label: '正常' },
  { value: '待处理', label: '待处理' },
]
const listStats: Array<{ label: string; value: string }> = []

function getInitialPreviewState(): PreviewState {
  if (typeof window === 'undefined') return 'normal'
  const value = new URLSearchParams(window.location.search).get('prototypeState') as PreviewState | null
  return value && previewStates.includes(value) ? value : 'normal'
}

function getVisiblePages(current: number, total: number, limit = 7) {
  if (total <= limit) return Array.from({ length: total }, (_, index) => index + 1)
  const start = Math.max(1, Math.min(current - Math.floor(limit / 2), total - limit + 1))
  return Array.from({ length: limit }, (_, index) => start + index)
}

export default function __COMPONENT_NAME__() {
  const [draft, setDraft] = useState({ keyword: '', status: '', category: '' })
  const [query, setQuery] = useState(draft)
  const [previewState, setPreviewState] = useState<PreviewState>(getInitialPreviewState)
  const [page, setPage] = useState(1)
  const [jumpPage, setJumpPage] = useState('1')

  const rows = useMemo(() => prototypeRows.filter((row) => {
    const keyword = query.keyword.trim().toLowerCase()
    const matchesKeyword = !keyword || `${row.id}${row.name}${row.owner}`.toLowerCase().includes(keyword)
    const matchesStatus = !query.status || row.status === query.status
    const matchesCategory = !query.category || row.category === query.category
    return matchesKeyword && matchesStatus && matchesCategory
  }), [query])

  const reset = () => {
    const empty = { keyword: '', status: '', category: '' }
    setDraft(empty)
    setQuery(empty)
    setPage(1)
    setJumpPage('1')
    setPreviewState('normal')
  }

  const visibleRows = previewState === 'empty' ? [] : rows
  const pageSize = 1
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedRows = visibleRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const pageNumbers = getVisiblePages(currentPage, totalPages)
  const goToPage = (next: number) => {
    const normalized = Math.min(totalPages, Math.max(1, next))
    setPage(normalized)
    setJumpPage(String(normalized))
  }
  const submitJump = () => goToPage(Number(jumpPage) || 1)
  const statusCounts = useMemo(() => statusTabs.map((tab) => ({
    ...tab,
    count: tab.value === '__all__' ? prototypeRows.length : prototypeRows.filter((row) => row.status === tab.value).length,
  })), [])
  const tableMessage = previewState === 'loading'
    ? '正在加载数据…'
    : previewState === 'error'
      ? '数据加载失败，请重新加载'
      : '暂无符合条件的记录'

  return <main
    data-prototype-page="__PAGE_SLUG__"
    data-state-coverage="loading empty error disabled success"
    data-list-density="compact"
    className="min-h-screen overflow-x-hidden bg-background text-foreground"
  >
    <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-4 p-4 lg:p-5">
      <header>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Users className="h-4 w-4" />业务工作台</div>
          <h1 className="text-xl font-semibold">__PAGE_TITLE__</h1>
          <p className="mt-1 text-sm text-muted-foreground">查看并处理相关业务数据。</p>
        </div>
      </header>

      {listStats.length ? <section aria-label="数据统计" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {listStats.map((item) => <Card key={item.label}>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle></CardHeader>
          <CardContent className="font-mono text-3xl font-semibold">{item.value}</CardContent>
        </Card>)}
      </section> : null}

      {previewState === 'success' ? <div className="flex items-start gap-3 rounded-2xl border bg-card p-4" role="status"><CheckCircle2 className="mt-0.5 h-5 w-5" /><div><div className="text-sm font-semibold">操作已完成</div><div className="mt-1 text-xs text-muted-foreground">操作结果已更新。</div></div></div> : null}

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs value={query.status || '__all__'} onValueChange={(value) => {
          const status = value === '__all__' ? '' : value
          setDraft((current) => ({ ...current, status }))
          setQuery((current) => ({ ...current, status }))
          setPage(1)
          setJumpPage('1')
        }} className="max-w-full overflow-x-auto">
          <TabsList className="h-auto min-w-max justify-start">
            {statusCounts.map((tab) => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}<span className="ml-1.5 text-xs text-muted-foreground">{tab.count}</span></TabsTrigger>)}
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="搜索记录" value={draft.keyword} onChange={(event) => setDraft((current) => ({ ...current, keyword: event.target.value }))} onKeyDown={(event) => { if (event.key === 'Enter') { setQuery(draft); setPage(1); setJumpPage('1') } }} placeholder="搜索编号 / 名称 / 用户" className="pl-9" disabled={previewState === 'disabled'} />
          </div>
          <Select value={draft.category || '__all__'} onValueChange={(value) => setDraft((current) => ({ ...current, category: value === '__all__' ? '' : value }))} disabled={previewState === 'disabled'}>
            <SelectTrigger className="w-full shrink-0 sm:w-40" aria-label="选择记录类型"><SelectValue /></SelectTrigger>
            <SelectContent><SelectGroup><SelectItem value="__all__">全部类型</SelectItem><SelectItem value="类型 A">类型 A</SelectItem><SelectItem value="类型 B">类型 B</SelectItem></SelectGroup></SelectContent>
          </Select>
          <Button size="sm" onClick={() => { setQuery(draft); setPage(1); setJumpPage('1') }} disabled={previewState === 'disabled'}>查询</Button>
          <Button size="sm" variant="ghost" onClick={reset}><RefreshCw className="mr-1.5 h-4 w-4" />重置</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
          <Table className="min-w-[860px] text-xs">
            <TableHeader><TableRow><TableHead className="h-9 px-3">记录</TableHead><TableHead className="h-9 px-3">负责人</TableHead><TableHead className="h-9 px-3">状态</TableHead><TableHead className="h-9 px-3">创建时间</TableHead><TableHead className="h-9 px-3">操作</TableHead></TableRow></TableHeader>
            <TableBody>
              {previewState === 'loading' || previewState === 'error' || visibleRows.length === 0 ? <TableRow><TableCell colSpan={5} className="h-32 px-3 py-2 text-center text-muted-foreground"><div className="flex flex-col items-center gap-3">{previewState === 'error' ? <AlertCircle className="h-5 w-5" /> : null}<span>{tableMessage}</span>{previewState === 'error' ? <Button size="sm" variant="outline" onClick={() => setPreviewState('normal')}>重新加载</Button> : null}</div></TableCell></TableRow> : pagedRows.map((row) => <TableRow key={row.id}><TableCell className="px-3 py-2"><div className="font-medium">{row.name}</div><div className="mt-0.5 font-mono text-xs text-muted-foreground">{row.id}</div></TableCell><TableCell className="px-3 py-2">{row.owner || '—'}</TableCell><TableCell className="px-3 py-2"><Badge variant={row.status === '正常' ? 'default' : 'outline'}>{row.status}</Badge></TableCell><TableCell className="px-3 py-2">{row.createdAt}</TableCell><TableCell className="px-3 py-2"><Button size="sm" className="h-7 px-2 text-xs" variant="outline" onClick={() => setPreviewState('success')}>查看详情</Button></TableCell></TableRow>)}
            </TableBody>
          </Table>
          <div className="flex flex-col gap-2 border-t px-3 py-2 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
            <span>第 {currentPage}/{totalPages} 页 · 共 {visibleRows.length} 条</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button size="sm" className="h-8 px-3 text-xs" variant="outline" disabled={currentPage <= 1} onClick={() => goToPage(1)}>« 首页</Button>
              <Button size="icon" className="h-8 w-8" variant="outline" aria-label="上一页" title="上一页" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              {pageNumbers.map((item) => <Button key={item} size="icon" className="h-8 w-8 text-xs" variant={item === currentPage ? 'default' : 'outline'} aria-label={`第 ${item} 页`} onClick={() => goToPage(item)}>{item}</Button>)}
              <Button size="icon" className="h-8 w-8" variant="outline" aria-label="下一页" title="下一页" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Button>
              <Button size="sm" className="h-8 px-3 text-xs" variant="outline" disabled={currentPage >= totalPages} onClick={() => goToPage(totalPages)}>尾页 »</Button>
              {totalPages > 1 ? <>
                <span className="ml-1">跳至</span>
                <Input aria-label="跳转页码" className="h-8 w-16 px-2 text-center text-xs" inputMode="numeric" value={jumpPage} onChange={(event) => setJumpPage(event.target.value.replace(/\D/g, ''))} onKeyDown={(event) => { if (event.key === 'Enter') submitJump() }} />
                <span>页</span>
                <Button size="sm" className="h-8 px-3 text-xs" variant="outline" onClick={submitJump}>跳转</Button>
              </> : null}
            </div>
          </div>
      </div>
    </div>
  </main>
}
