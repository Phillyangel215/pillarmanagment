/**
 * @fileoverview Forms - Form catalog and management dashboard
 * @description Browse available forms, manage responses, and access form builder
 * @version 1.0.0 - Production implementation
 * @accessibility WCAG AA compliant with keyboard navigation and screen reader support
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formsService, FormTemplate } from '@/services/forms'
import { canUserManageForms, canUserBuildForms } from '@/forms/schema'
import { TEMPLATE_CATEGORIES } from '@/forms/templates'
import { CsvExport } from '@/components/common/CsvExport'

interface FormsProps {
  userRoles: string[]
  onNavigate: (path: string) => void
}

export default function Forms({ userRoles, onNavigate }: FormsProps) {
  const [templates, setTemplates] = useState<FormTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  const canManage = canUserManageForms(userRoles)
  const canBuild = canUserBuildForms(userRoles)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const allTemplates = await formsService.listTemplates()
      
      // Filter templates based on user roles
      const accessibleTemplates = allTemplates.filter(template =>
        template.schema.allowedRoles.some(role => userRoles.includes(role))
      )
      
      setTemplates(accessibleTemplates)
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.schema.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categoryCounts = Object.keys(TEMPLATE_CATEGORIES).reduce((acc, category) => {
    acc[category] = templates.filter(t => t.category === category).length
    return acc
  }, {} as Record<string, number>)

  const getCategoryIcon = (category: string) => {
    return TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES]?.icon || '📄'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      CLIENT: 'bg-primary-100 text-primary-700 border-primary-200',
      HR: 'bg-success-100 text-success-700 border-success-200',
      GOVERNANCE: 'bg-warning-100 text-warning-700 border-warning-200',
      COMPLIANCE: 'bg-error-100 text-error-700 border-error-200',
      FINANCE: 'bg-charcoal-100 text-charcoal-700 border-charcoal-200',
      OPERATIONS: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200'
    }
    return colors[category as keyof typeof colors] || 'bg-charcoal-100 text-charcoal-600'
  }

  // Simple CSV export of visible templates
  const exportTemplatesCsv = () => {
    const rows = filteredTemplates.map(t => ({
      slug: t.slug,
      name: t.name,
      category: t.category,
      version: t.schema.version,
      fields: t.schema.fields.length,
      requiresSignature: t.schema.requiresSignature ? 'yes' : 'no',
      multiStep: t.schema.multiStep ? 'yes' : 'no'
    }))
    return rows
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-2 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-48 bg-surface-2 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Forms</h1>
            <p className="text-muted mt-1">Complete forms, manage responses, and track submissions</p>
          </div>
          <div className="flex items-center gap-3">
            {canManage && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onNavigate('/forms/manage')}
                className="motion-safe-fast"
              >
                Manage Responses
              </Button>
            )}
            {canBuild && (
              <Button 
                size="sm" 
                onClick={() => onNavigate('/forms/builder')}
                className="motion-safe-fast hover-glow"
              >
                Form Builder
              </Button>
            )}
            <CsvExport
              data={exportTemplatesCsv()}
              filename="forms-catalog"
            >
              Export Catalog
            </CsvExport>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  id="forms-search"
                  label="Search"
                  type="search"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(val) => setSearchQuery(val)}
                  className="w-full"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="motion-safe-fast"
                >
                  All ({templates.length})
                </Button>
                {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className="motion-safe-fast"
                  >
                    {getCategoryIcon(key)} {(category as any).name} ({categoryCounts[key] || 0})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.slug} className="glass-card motion-safe hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                      <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                        {TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES]?.name}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.schema.description && (
                      <p className="text-sm text-muted mt-1">{template.schema.description}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Form metadata */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Fields:</span>
                    <span className="text-text">{template.schema.fields.length}</span>
                  </div>
                  
                  {template.schema.multiStep && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Steps:</span>
                      <span className="text-text">{template.schema.sections?.length || 1}</span>
                    </div>
                  )}
                  
                  {template.schema.requiresSignature && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-sm text-muted">Signature Required</span>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-surface-4">
                    <Button 
                      size="sm" 
                      onClick={() => onNavigate(`/forms/fill/${template.slug}`)}
                      className="flex-1 motion-safe-fast hover-glow"
                    >
                      Fill Form
                    </Button>
                    {canManage && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onNavigate(`/forms/manage/${template.slug}`)}
                        className="motion-safe-fast"
                      >
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && !loading && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-text mb-2">No forms found</h3>
              <p className="text-muted mb-4">
                {searchQuery 
                  ? `No forms match "${searchQuery}". Try adjusting your search or category filter.`
                  : 'No forms are available for your current role.'
                }
              </p>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="motion-safe-fast"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-text">{templates.length}</p>
              <p className="text-sm text-muted">Available Forms</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-text">{templates.filter(t => t.schema.requiresSignature).length}</p>
              <p className="text-sm text-muted">Require Signature</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-text">{templates.filter(t => t.schema.multiStep).length}</p>
              <p className="text-sm text-muted">Multi-Step Forms</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-text">{Object.keys(TEMPLATE_CATEGORIES).length}</p>
              <p className="text-sm text-muted">Categories</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Usage example:
/*
<Forms
  userRoles={['PROGRAM_DIRECTOR', 'CASE_WORKER']}
  onNavigate={(path) => router.push(path)}
/>
*/

