import React, { useState } from 'react';
import PresenterBar from '@/components/demo/PresenterBar';
import DemoDashboardRow from '@/components/demo/DemoDashboardRow';

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
  AuditLogs: null,
  Auth_Login: null,
  Auth_Register: null,
  Auth_Reset: null,
};

export default function DemoGallery() {
  const [key, setKey] = useState<keyof typeof pages>('Dashboard_ProgramDirector');
  const Page = pages[key];
  return (
    <div className="min-h-screen bg-[var(--color-surface,#0E0F13)] text-[var(--color-text,#F5F7FA)] p-6">
      {import.meta.env.VITE_DEMO === '1' && (
        <div className="mb-4 space-y-4">
          <PresenterBar />
          <DemoDashboardRow />
        </div>
      )}
      <div className="flex gap-2 flex-wrap mb-4">
        {Object.keys(pages).map(k => (
          <button key={k} onClick={() => setKey(k as keyof typeof pages)} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">
            {k}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-white/10 p-4">
        {Page ? <Page /> : <div className="opacity-70">Screen scaffold "{key}" not imported yet.</div>}
      </div>
    </div>
  );
}
