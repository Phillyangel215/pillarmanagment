/**
 * @fileoverview CsvImport - CSV import utility component
 * @description CSV file upload with validation, preview, and import functionality
 * @version 1.0.0 - Production implementation
 * @accessibility Keyboard accessible with proper labels and error handling
 */

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface CsvImportProps {
  onImport: (data: Record<string, any>[]) => Promise<void>
  expectedHeaders?: string[]
  maxRows?: number
  className?: string
  title?: string
  description?: string
}

interface ParsedData {
  headers: string[]
  rows: string[][]
  errors: string[]
  preview: Record<string, any>[]
}

export function CsvImport({
  onImport,
  expectedHeaders = [],
  maxRows = 1000,
  className = '',
  title = 'Import CSV Data',
  description = 'Upload a CSV file to import data'
}: CsvImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [importing, setImporting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.includes('csv') && !selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB')
      return
    }

    setFile(selectedFile)
    await parseFile(selectedFile)
  }

  const parseFile = async (file: File) => {
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length === 0) {
        setParsedData({ headers: [], rows: [], errors: ['File is empty'], preview: [] })
        return
      }

      // Parse CSV (simple implementation - for production use a proper CSV parser)
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const dataRows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      )

      // Validation
      const errors: string[] = []
      
      if (expectedHeaders.length > 0) {
        const missingHeaders = expectedHeaders.filter(expected => 
          !headers.some(header => header.toLowerCase() === expected.toLowerCase())
        )
        if (missingHeaders.length > 0) {
          errors.push(`Missing required headers: ${missingHeaders.join(', ')}`)
        }
      }

      if (dataRows.length > maxRows) {
        errors.push(`Too many rows. Maximum allowed: ${maxRows}, found: ${dataRows.length}`)
      }

      // Create preview data (first 5 rows)
      const preview = dataRows.slice(0, 5).map(row => {
        const obj: Record<string, any> = {}
        headers.forEach((header, index) => {
          obj[header] = row[index] || ''
        })
        return obj
      })

      setParsedData({
        headers,
        rows: dataRows,
        errors,
        preview
      })

      setShowPreview(true)
    } catch (error) {
      console.error('Failed to parse CSV:', error)
      setParsedData({ 
        headers: [], 
        rows: [], 
        errors: ['Failed to parse CSV file. Please check the format.'], 
        preview: [] 
      })
    }
  }

  const handleImport = async () => {
    if (!parsedData || parsedData.errors.length > 0) return

    try {
      setImporting(true)

      // Convert rows to objects
      const data = parsedData.rows.map(row => {
        const obj: Record<string, any> = {}
        parsedData.headers.forEach((header, index) => {
          obj[header] = row[index] || ''
        })
        return obj
      })

      await onImport(data)
      
      // Reset state
      setFile(null)
      setParsedData(null)
      setShowPreview(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      alert(`Successfully imported ${data.length} records`)
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  const reset = () => {
    setFile(null)
    setParsedData(null)
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted">{description}</p>
        </CardHeader>
        <CardContent>
          {!showPreview ? (
            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-surface-4 rounded-lg p-6 text-center hover:border-primary-500/50 motion-safe-fast">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-file-input"
                />
                <label
                  htmlFor="csv-file-input"
                  className="cursor-pointer space-y-2 block"
                >
                  <svg className="w-12 h-12 text-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p className="text-text font-medium">Click to upload CSV file</p>
                    <p className="text-sm text-muted">or drag and drop</p>
                  </div>
                </label>
              </div>

              {/* Requirements */}
              {expectedHeaders.length > 0 && (
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <h4 className="text-sm font-medium text-primary-800 mb-2">Required Headers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {expectedHeaders.map((header) => (
                      <Badge key={header} className="bg-primary-100 text-primary-700">
                        {header}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted space-y-1">
                <p>• Maximum file size: 5MB</p>
                <p>• Maximum rows: {maxRows.toLocaleString()}</p>
                <p>• Supported format: CSV (.csv)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-text">{file?.name}</p>
                  <p className="text-xs text-muted">
                    {parsedData?.rows.length} rows, {parsedData?.headers.length} columns
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={reset} className="motion-safe-fast">
                  Change File
                </Button>
              </div>

              {/* Errors */}
              {parsedData?.errors && parsedData.errors.length > 0 && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                  <h4 className="text-sm font-medium text-error-800 mb-2">Validation Errors:</h4>
                  <ul className="text-sm text-error-700 space-y-1">
                    {parsedData.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview */}
              {parsedData?.preview && parsedData.preview.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text mb-3">Preview (first 5 rows):</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-surface-4 rounded-lg">
                      <thead>
                        <tr className="bg-surface-2">
                          {parsedData.headers.map((header) => (
                            <th key={header} className="px-3 py-2 text-left text-muted font-medium border-b border-surface-4">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.preview.map((row, index) => (
                          <tr key={index} className="hover:bg-surface-2">
                            {parsedData.headers.map((header) => (
                              <td key={header} className="px-3 py-2 text-text border-b border-surface-4">
                                {String(row[header] || '').substring(0, 50)}
                                {String(row[header] || '').length > 50 && '...'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleImport}
                  disabled={!parsedData || parsedData.errors.length > 0 || importing}
                  className="motion-safe-fast hover-glow"
                >
                  {importing ? 'Importing...' : `Import ${parsedData?.rows.length || 0} Records`}
                </Button>
                <Button variant="outline" onClick={reset} className="motion-safe-fast">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Usage examples:
/*
// Basic donor import
<CsvImport
  onImport={async (data) => {
    await importDonors(data)
  }}
  expectedHeaders={['firstName', 'lastName', 'email', 'totalGiven']}
  filename="donors"
  title="Import Donors"
  description="Upload a CSV file with donor information"
/>

// Grant import with validation
<CsvImport
  onImport={async (data) => {
    const processedData = data.map(row => ({
      ...row,
      amount: parseFloat(row.amount) || 0,
      submissionDate: new Date(row.submissionDate).toISOString()
    }))
    await importGrants(processedData)
  }}
  expectedHeaders={['title', 'funder', 'amount', 'submissionDate']}
  maxRows={500}
  title="Import Grant Applications"
/>
*/
