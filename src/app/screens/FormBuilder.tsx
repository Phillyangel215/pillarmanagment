import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextArea } from '@/components/ui/TextArea'
import { Select } from '@/components/ui/Select'
import { getAllTemplates } from '@/forms/templates'
import { FormSchema } from '@/forms/schema'

interface FormBuilderProps {
  onBack: () => void
}

export default function FormBuilder({ onBack }: FormBuilderProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [json, setJson] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [preview, setPreview] = useState<FormSchema | null>(null)

  const templates = useMemo(() => getAllTemplates(), [])

  useEffect(() => {
    if (!selectedSlug && templates.length > 0) {
      setSelectedSlug(templates[0].slug)
    }
  }, [templates, selectedSlug])

  useEffect(() => {
    const tpl = templates.find(t => t.slug === selectedSlug)
    if (tpl) {
      const text = JSON.stringify(tpl.schema, null, 2)
      setJson(text)
      setPreview(tpl.schema)
      setError('')
    }
  }, [selectedSlug, templates])

  const onValidate = () => {
    try {
      const parsed = JSON.parse(json)
      // Basic checks
      if (!parsed.slug || !parsed.fields) throw new Error('Missing slug or fields')
      setPreview(parsed)
      setError('')
    } catch (e: any) {
      setError(e.message || 'Invalid JSON')
    }
  }

  const onSave = () => {
    try {
      const parsed = JSON.parse(json)
      parsed.version = (parsed.version || 1) + 1
      localStorage.setItem(`demo_form_template_override_${parsed.slug}`, JSON.stringify({
        id: `${parsed.slug}-v${parsed.version}`,
        slug: parsed.slug,
        name: parsed.name,
        category: parsed.category,
        schema: parsed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      setPreview(parsed)
      setJson(JSON.stringify(parsed, null, 2))
      alert('Template saved (demo override). Version bumped.')
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    }
  }

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Form Builder (Demo)</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onBack}>Back</Button>
            <Button onClick={onValidate}>Validate</Button>
            <Button onClick={onSave} className="hover-glow">Save & Bump Version</Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Select Template</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                id="builder-template"
                label="Template"
                value={selectedSlug}
                onChange={val => setSelectedSlug(val)}
                options={templates.map(t => ({ value: t.slug, label: t.name }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Schema JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <TextArea
                id="builder-json"
                label="Schema JSON"
                value={json}
                onChange={val => setJson(val)}
                rows={24}
                className="font-mono text-xs"
              />
              {error && (
                <p className="mt-2 text-sm text-error-600" role="alert">{error}</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {preview ? (
                  <>
                    <div><span className="text-muted">Name:</span> {preview.name}</div>
                    <div><span className="text-muted">Slug:</span> {preview.slug}</div>
                    <div><span className="text-muted">Category:</span> {preview.category}</div>
                    <div><span className="text-muted">Fields:</span> {preview.fields.length}</div>
                    <div><span className="text-muted">Signature:</span> {preview.requiresSignature ? 'Yes' : 'No'}</div>
                  </>
                ) : (
                  <div className="text-muted">Invalid or no schema to preview</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


