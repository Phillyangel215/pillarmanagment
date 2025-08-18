# Super Admin Bootstrap Runbook

Use this runbook to create the first SUPER_ADMIN using a service role token. Do NOT commit secrets.

Prereqs:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE

Steps:
1. Create a local env file with your Supabase credentials.
2. Run the local-only script:

```bash
node scripts/bootstrap-super-admin.mjs \
  --email you@example.com \
  --password 'TempPass123!' \
  --first "Your" \
  --last "Name"
```

Warnings:
- Never run with production data without approval.
- Rotate the temporary password immediately.
- Ensure RLS and audit logs are enabled before inviting additional users.