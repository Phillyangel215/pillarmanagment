import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CsvExport } from '@/components/common/CsvExport'
import { formsService, FormResponse, FormTemplate } from '@/services/forms'

interface FormManageProps {
  slug?: string
  onNavigate: (path: string) => void
}

export default function FormManage({ slug, onNavigate }: FormManageProps) {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [templates, setTemplates] = useState<FormTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [templateSlug, setTemplateSlug] = useState<string>(slug || 'all')

  useEffect(() => {
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  async function load() {
    try {
      setLoading(true)
      const tpls = await formsService.listTemplates()
      setTemplates(tpls)
      const resps = await formsService.listResponses(slug)
      setResponses(resps)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let list = responses
    if (templateSlug !== 'all') list = list.filter(r => r.templateSlug === templateSlug)
    if (status !== 'all') list = list.filter(r => r.status === status)
    if (dateFrom) list = list.filter(r => new Date(r.createdAt) >= new Date(dateFrom))
    if (dateTo) list = list.filter(r => new Date(r.createdAt) <= new Date(dateTo))
    if (q) {
      const ql = q.toLowerCase()
      list = list.filter(r => {
        const meta = `${r.templateSlug} ${r.status} ${r.createdBy}`.toLowerCase()
        const dataText = JSON.stringify(r.data).toLowerCase()
        return meta.includes(ql) || dataText.includes(ql)
      })
    }
    return list
  }, [responses, templateSlug, status, dateFrom, dateTo, q])

  const exportRows = filtered.map(r => ({
    id: r.id,
    template: r.templateSlug,
    status: r.status,
    createdBy: r.createdBy,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  }))

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-2 rounded w-64" />
            <div className="h-32 bg-surface-2 rounded" />
            <div className="h-64 bg-surface-2 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Form Responses</h1>
          <div className="flex items-center gap-2">
            <CsvExport data={exportRows} filename="form-responses" />
            <Button variant="ghost" onClick={() => load()}>Refresh</Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <Input
                id="responses-search"
                label="Search"
                placeholder="Search..."
                value={q}
                onChange={val => setQ(val)}
              />
            </div>
            <Select
              id="responses-template"
              label="Template"
              value={templateSlug}
              onChange={val => setTemplateSlug(val)}
              options={[{ value: 'all', label: 'All Templates' }, ...templates.map(t => ({ value: t.slug, label: t.name }))]}
            />
            <Select
              id="responses-status"
              label="Status"
              value={status}
              onChange={val => setStatus(val)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'draft', label: 'Draft' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'signed', label: 'Signed' },
                { value: 'archived', label: 'Archived' }
              ]}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input id="date-from" label="From" type="text" value={dateFrom} onChange={val => setDateFrom(val)} />
              <Input id="date-to" label="To" type="text" value={dateTo} onChange={val => setDateTo(val)} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Responses ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-surface-4">
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">By</th>
                    <th className="px-4 py-3">Template</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Updated</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="border-b border-surface-3 hover:bg-surface-2">
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">{r.createdBy}</td>
                      <td className="px-4 py-3">{r.templateSlug}</td>
                      <td className="px-4 py-3 capitalize">{r.status}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(r.updatedAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => onNavigate(`/forms/response/${r.id}`)}>Open</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-muted" colSpan={6}>No responses match your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


