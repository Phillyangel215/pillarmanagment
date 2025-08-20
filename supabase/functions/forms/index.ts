import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const app = new Hono()

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Create Supabase client
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
}

// GET /forms/templates - List form templates
app.get('/templates', async (c) => {
  try {
    const supabase = getSupabaseClient()
    
    const { data: templates, error } = await supabase
      .from('form_templates')
      .select('*')
      .order('name')
    
    if (error) {
      return c.json({ error: error.message }, 500)
    }
    
    return c.json({ templates })
  } catch (error) {
    console.error('Failed to list templates:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GET /forms/templates/:slug - Get specific template
app.get('/templates/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const supabase = getSupabaseClient()
    
    const { data: template, error } = await supabase
      .from('form_templates')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      return c.json({ error: error.message }, 404)
    }
    
    return c.json({ template })
  } catch (error) {
    console.error('Failed to get template:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// POST /forms/responses - Submit form response
app.post('/responses', async (c) => {
  try {
    const { templateSlug, data } = await c.req.json()
    const supabase = getSupabaseClient()
    
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('form_templates')
      .select('id')
      .eq('slug', templateSlug)
      .single()
    
    if (templateError) {
      return c.json({ error: 'Template not found' }, 404)
    }
    
    // Get user from JWT
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Authorization required' }, 401)
    }
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (userError || !user) {
      return c.json({ error: 'Invalid authorization' }, 401)
    }
    
    // Create response
    const { data: response, error: responseError } = await supabase
      .from('form_responses')
      .insert({
        template_id: template.id,
        status: 'submitted',
        data,
        created_by: user.id
      })
      .select()
      .single()
    
    if (responseError) {
      return c.json({ error: responseError.message }, 500)
    }
    
    return c.json({ responseId: response.id })
  } catch (error) {
    console.error('Failed to submit form:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// POST /forms/responses/draft - Save draft
app.post('/responses/draft', async (c) => {
  try {
    const { templateSlug, data } = await c.req.json()
    const supabase = getSupabaseClient()

    // Get template id
    const { data: template, error: templateError } = await supabase
      .from('form_templates')
      .select('id')
      .eq('slug', templateSlug)
      .single()
    if (templateError) return c.json({ error: 'Template not found' }, 404)

    // Get user from JWT
    const authHeader = c.req.header('Authorization')
    if (!authHeader) return c.json({ error: 'Authorization required' }, 401)
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) return c.json({ error: 'Invalid authorization' }, 401)

    const { data: response, error } = await supabase
      .from('form_responses')
      .insert({
        template_id: template.id,
        status: 'draft',
        data,
        created_by: user.id
      })
      .select()
      .single()
    if (error) return c.json({ error: error.message }, 500)
    return c.json({ responseId: response.id })
  } catch (error) {
    console.error('Failed to save draft:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GET /forms/responses/:id - Get single response
app.get('/responses/:id', async (c) => {
  try {
    const responseId = c.req.param('id')
    const supabase = getSupabaseClient()
    const { data: response, error } = await supabase
      .from('form_responses')
      .select('*')
      .eq('id', responseId)
      .single()
    if (error) return c.json({ error: 'Response not found' }, 404)
    return c.json({ response })
  } catch (error) {
    console.error('Failed to get response:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// POST /forms/upload - Upload a file to private storage and return signed URL
app.post('/upload', async (c) => {
  try {
    const supabase = getSupabaseClient()
    const authHeader = c.req.header('Authorization')
    if (!authHeader) return c.json({ error: 'Authorization required' }, 401)
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) return c.json({ error: 'Invalid authorization' }, 401)

    const form = await c.req.parseBody()
    const file = form['file'] as File
    const fieldId = String(form['fieldId'] || '')
    const responseId = String(form['responseId'] || '')
    if (!file || !fieldId) return c.json({ error: 'Missing file or fieldId' }, 400)

    // Validate content type and size (basic)
    const allowedContent = [
      'image/png', 'image/jpeg', 'application/pdf'
    ]
    if (!allowedContent.includes(file.type)) {
      return c.json({ error: 'Unsupported content type' }, 415)
    }
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File too large' }, 413)
    }

    // Determine storage path; use responseId if provided, else stage under user id
    const folder = responseId && responseId !== 'pending' ? `${user.id}/${responseId}` : `${user.id}/staged`
    const path = `${folder}/${crypto.randomUUID()}-${file.name}`
    const bucket = 'forms_uploads'

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, new Uint8Array(arrayBuffer), {
        contentType: file.type,
        upsert: false
      })
    if (uploadError) return c.json({ error: uploadError.message }, 500)

    // Create signed URL short TTL
    const { data: signed, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 5)
    if (signError || !signed) return c.json({ error: signError?.message || 'Sign failed' }, 500)

    return c.json({
      upload: {
        id: crypto.randomUUID(),
        fieldId,
        responseId,
        filename: file.name,
        contentType: file.type,
        size: file.size,
        url: signed.signedUrl,
        uploadedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Upload failed:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// POST /forms/responses/:id/sign - Add signature to form
app.post('/responses/:id/sign', async (c) => {
  try {
    const responseId = c.req.param('id')
    const { signatureData, metadata } = await c.req.json()
    const supabase = getSupabaseClient()
    
    // Get current response
    const { data: response, error: responseError } = await supabase
      .from('form_responses')
      .select('signatures')
      .eq('id', responseId)
      .single()
    
    if (responseError) {
      return c.json({ error: 'Response not found' }, 404)
    }
    
    // Add new signature
    const signatures = response.signatures || []
    const newSignature = {
      ...metadata,
      timestamp: new Date().toISOString(),
      ipAddress: c.req.header('x-forwarded-for') || 'unknown',
      userAgent: c.req.header('user-agent') || 'unknown',
      signatureData
    }
    
    signatures.push(newSignature)
    
    // Update response
    const { error: updateError } = await supabase
      .from('form_responses')
      .update({ 
        signatures,
        status: 'signed',
        updated_at: new Date().toISOString()
      })
      .eq('id', responseId)
    
    if (updateError) {
      return c.json({ error: updateError.message }, 500)
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Failed to sign form:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GET /forms/responses - List form responses
app.get('/responses', async (c) => {
  try {
    const templateSlug = c.req.query('template')
    const status = c.req.query('status')
    const supabase = getSupabaseClient()
    
    let query = supabase
      .from('form_responses')
      .select(`
        *,
        form_templates!inner(slug, name)
      `)
      .order('created_at', { ascending: false })
    
    if (templateSlug) {
      query = query.eq('form_templates.slug', templateSlug)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: responses, error } = await query
    
    if (error) {
      return c.json({ error: error.message }, 500)
    }
    
    return c.json({ responses })
  } catch (error) {
    console.error('Failed to list responses:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    service: 'forms-api',
    timestamp: new Date().toISOString() 
  })
})

export default app

// Deno serve entrypoint
Deno.serve(app.fetch)

