/**
 * @fileoverview CsvExport - CSV export utility component
 * @description Converts table data to CSV and triggers download
 * @version 1.0.0 - Production implementation
 * @accessibility Keyboard accessible with proper labels
 */

import React from 'react'
import { Button } from '@/components/ui/Button'

interface CsvExportProps {
  data: Record<string, any>[]
  filename?: string
  headers?: Record<string, string> // Maps field names to display names
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'default'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function CsvExport({
  data,
  filename = 'export',
  headers,
  className = '',
  variant = 'outline',
  size = 'sm',
  children
}: CsvExportProps) {
  const exportToCsv = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    try {
      // Get headers from first row or use provided headers
      const firstRow = data[0]
      const fieldNames = Object.keys(firstRow)
      const headerLabels = headers || fieldNames.reduce((acc, field) => {
        acc[field] = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
        return acc
      }, {} as Record<string, string>)

      // Create CSV content
      const csvHeaders = fieldNames.map(field => headerLabels[field] || field)
      const csvRows = data.map(row => 
        fieldNames.map(field => {
          const value = row[field]
          // Handle different data types
          if (value === null || value === undefined) return ''
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`
          }
          return String(value)
        })
      )

      // Combine headers and rows
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.join(','))
        .join('\n')

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export CSV:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={exportToCsv}
      className={`motion-safe-fast ${className}`}
      aria-label={`Export ${data.length} rows to CSV`}
    >
      {children || (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </>
      )}
    </Button>
  )
}

// Usage examples:
/*
// Basic usage
<CsvExport
  data={donors}
  filename="donors"
/>

// With custom headers
<CsvExport
  data={grants}
  filename="grants-pipeline"
  headers={{
    grantId: 'Grant ID',
    funderName: 'Funding Organization',
    totalAmount: 'Award Amount',
    submissionDate: 'Date Submitted'
  }}
/>

// Custom button content
<CsvExport
  data={contracts}
  filename="contracts-registry"
  variant="default"
  size="md"
>
  <Download className="w-4 h-4 mr-2" />
  Download Contract Registry
</CsvExport>
*/
