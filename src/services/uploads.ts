export type UploadResult = { key: string; url?: string }

const ALLOW = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/png','image/jpeg','text/plain']
const MAX = 25 * 1024 * 1024

export async function putObject(file: File): Promise<UploadResult> {
  if (!ALLOW.includes(file.type)) throw new Error('File type not allowed')
  if (file.size > MAX) throw new Error('File too large')

  if (import.meta.env.VITE_DEMO === '1') {
    return { key: `demo/${Date.now()}_${file.name}` }
  }

  // Production path (Supabase Storage placeholder)
  const res = await fetch('/functions/v1/upload', { method: 'POST', body: file })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return { key: data.key, url: data.signedUrl }
}

