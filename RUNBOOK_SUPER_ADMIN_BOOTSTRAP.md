# Runbook: Super Admin Bootstrap

One-time safe bootstrap to create the first Super Admin.

## Preferred: Local script (not deployed)

Prereqs: `.env.local` contains `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE`

```bash
node scripts/bootstrap-super-admin.mjs
```

The script prompts for email/password and sets `app_metadata.roles = ["SUPER_ADMIN"]`.

## Temporary Edge Function (only if needed)

Create `supabase/functions/bootstrap_super_admin/index.ts` that requires header `X-Bootstrap-Token` matching `BOOTSTRAP_TOKEN`. Deploy, call once, then delete/disable immediately. This method is riskier; use only when you cannot run the local script.

## Post-bootstrap steps
- Change the Super Admin password immediately
- Enable 2FA for the Super Admin account
- Rotate the service role key if it was used locally

