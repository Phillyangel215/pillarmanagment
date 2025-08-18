import React, { useState } from 'react';
import { useSession } from '@/auth/session';
import { logout } from '@/app/actions/auth';
import { Auth_Login } from '@/app/screens/Auth_Login';
import Auth_Register from '@/app/screens/Auth_Register';
import Auth_Reset from '@/app/screens/Auth_Reset';
import PresenterBar from '@/components/demo/PresenterBar';
import DemoDashboardRow from '@/components/demo/DemoDashboardRow';
import AuditLogViewer from '@/components/demo/AuditLogViewer';

// Import available screens if they exist; otherwise leave null placeholders.
const pages: Record<string, React.ComponentType | null> = {
  Dashboard_ProgramDirector: null,
  Dashboard_DevelopmentDirector: null,
  Dashboard_HRManager: null,
  Dashboard_BoardSecretary: null,
  Intake: null,
  CaseManagement: null,
  HousingPlacement: null,
  Tasks_Projects: null,
  Training_Compliance: null,
  Notifications: null,
  Reports: null,
  Settings: null,
  AuditLogs: AuditLogViewer,
  Auth_Login,
  Auth_Register,
  Auth_Reset,
};

export default function DemoGallery() {
  const [key, setKey] = useState<keyof typeof pages>('Dashboard_ProgramDirector');
  const Page = pages[key as string];
  const keys = Object.keys(pages) as (keyof typeof pages)[];
  return (
    <div className="min-h-screen bg-[var(--color-surface,#0E0F13)] text-[var(--color-text,#F5F7FA)] p-6">
      <SessionStrip />
      {import.meta.env.VITE_DEMO === '1' && (
        <div className="mb-4 space-y-4">
          <PresenterBar />
          <DemoDashboardRow />
        </div>
      )}
      <div className="flex gap-2 flex-wrap mb-4">
        {keys.map((k) => (
          <button key={k as string} onClick={() => setKey(k)} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">
            {k as string}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-white/10 p-4">
        {Page ? <Page /> : <div className="opacity-70">Screen scaffold "{key as string}" not imported yet.</div>}
      </div>
    </div>
  );
}

function SessionStrip() {
  const { userId } = useSession()
  if (!userId) return null
  return (
    <div className="mb-4 flex items-center justify-between rounded-md border border-white/10 p-2 text-sm opacity-90">
      <span>Signed in as {userId}</span>
      <button onClick={() => { void logout() }} className="px-2 py-1 rounded-md border border-white/10 hover:bg-white/5">Sign out</button>
    </div>
  )
}