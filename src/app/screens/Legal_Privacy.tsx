import React from 'react'

export default function Legal_Privacy() {
  return (
    <div className="prose prose-invert max-w-3xl">
      <h1>Privacy Policy</h1>
      <p>This demo stores data locally in your browser (localStorage). No personal data is sent to a server in demo mode.</p>
      <h2>Data Retention</h2>
      <p>You can reset demo data using the DEMO MODE toolbar. Closing the browser may not clear data automatically.</p>
      <h2>Security</h2>
      <p>For production, configure encryption at rest, RLS, and audit logging on your backend.</p>
    </div>
  )
}

