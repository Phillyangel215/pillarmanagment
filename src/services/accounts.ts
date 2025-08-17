export async function createAccount(input: { email: string }): Promise<{ id: string }> {
  const res = await fetch('/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  const data = await res.json()
  return { id: data.id ?? 'demo-id' }
}

