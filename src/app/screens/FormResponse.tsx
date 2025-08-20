import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formsService, FormResponse } from '@/services/forms'
import { FormEngine } from '@/forms/FormEngine'
import { FormSchema } from '@/forms/schema'
import { exportResponsePdf } from '@/forms/pdf'

interface FormResponseViewProps {
  responseId: string
  onBack: () => void
}

export default function FormResponseView({ responseId, onBack }: FormResponseViewProps) {
  const [response, setResponse] = useState<FormResponse | null>(null)
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseId])

  async function load() {
    try {
      setLoading(true)
      const resp = await formsService.getResponse(responseId)
      if (!resp) return
      setResponse(resp)
      const tpl = await formsService.getTemplate(resp.templateSlug)
      if (tpl) setSchema(tpl.schema)
    } finally {
      setLoading(false)
    }
  }

  const onDownloadPdf = async () => {
    if (!schema || !response) return
    await exportResponsePdf({ container: containerRef.current, schema, response })
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-2 rounded w-64" />
            <div className="h-48 bg-surface-2 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!response || !schema) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <p className="text-muted">Response not found.</p>
            <Button variant="ghost" onClick={onBack} className="mt-3">Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">{schema.name}</h1>
          <div className="flex items-center gap-2">
            <Button onClick={onDownloadPdf} className="hover-glow">Download signed PDF</Button>
            <Button variant="ghost" onClick={onBack}>Back</Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted">Response ID:</span> {response.id}</div>
            <div><span className="text-muted">Status:</span> {response.status}</div>
            <div><span className="text-muted">Submitted:</span> {new Date(response.createdAt).toLocaleString()}</div>
            <div><span className="text-muted">Updated:</span> {new Date(response.updatedAt).toLocaleString()}</div>
          </CardContent>
        </Card>

        <div ref={containerRef}>
          <FormEngine
            schema={schema}
            initialData={response.data}
            onSubmit={async () => {}}
            mode="view"
            className="p-0"
          />
        </div>
      </div>
    </div>
  )
}


