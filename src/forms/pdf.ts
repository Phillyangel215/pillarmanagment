import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import { FormSchema } from '@/forms/schema'
import { FormResponse } from '@/services/forms'

function formatValue(value: any): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) return value.join(', ')
    // address object formatting
    if ('street' in value && 'city' in value) {
      const parts = [value.street, value.city, value.state, value.zipCode].filter(Boolean)
      return parts.join(', ')
    }
    return JSON.stringify(value)
  }
  return String(value)
}

async function sha256String(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function exportResponsePdf(options: {
  container?: HTMLElement | null
  schema: FormSchema
  response: FormResponse
  title?: string
}): Promise<void> {
  const { container, schema, response } = options
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  // If a container is provided, rasterize current view for the first page
  if (container) {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = (canvas.height * pageWidth) / canvas.width
    doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST')
  } else {
    // Fallback: render a simple text summary
    const margin = 40
    let y = margin
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(schema.name || 'Form Response', margin, y)
    y += 24
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    schema.fields.forEach(field => {
      const val = formatValue(response.data[field.id])
      if (!val) return
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(`${field.label}: ${val}`, margin, y)
      y += 16
    })
  }

  // Evidence page
  doc.addPage()
  const margin = 40
  let y = margin
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Evidence Page', margin, y)
  y += 24
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')

  // Signatures
  const signatures = response.signatures || []
  doc.text(`Signatures (${signatures.length})`, margin, y)
  y += 18
  signatures.forEach((sig, idx) => {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(`- #${idx + 1} by: ${sig.by || 'user'} | when: ${sig.timestamp} | ip: ${sig.ipAddress} | ua: ${sig.userAgent || ''}`, margin, y)
    y += 16
  })

  // Payload hash
  const payloadJson = JSON.stringify({ schemaSlug: schema.slug, responseId: response.id, data: response.data })
  const hash = await sha256String(payloadJson)
  if (y > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage()
    y = margin
  }
  y += 12
  doc.setFont('helvetica', 'bold')
  doc.text('Payload SHA-256:', margin, y)
  y += 16
  doc.setFont('helvetica', 'normal')
  const hashChunks = hash.match(/.{1,64}/g) || [hash]
  hashChunks.forEach(line => {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(line, margin, y)
    y += 14
  })

  doc.save(`${schema.slug}-${response.id}.pdf`)
}


