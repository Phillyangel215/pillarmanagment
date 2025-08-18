import React, { useState } from 'react';
import NotificationBell from '@/components/common/NotificationBell';
import { Auth_Login } from './screens/Auth_Login';
import { Dashboard_ProgramDirector } from './screens/Dashboard_ProgramDirector';
import { Dashboard_DevelopmentDirector } from './screens/Dashboard_DevelopmentDirector';
import { Dashboard_HRManager } from './screens/Dashboard_HRManager';
import { Dashboard_BoardSecretary } from './screens/Dashboard_BoardSecretary';
import { Intake } from './screens/Intake';
import { CaseManagement } from './screens/CaseManagement';
import { Reports } from './screens/Reports';

// Import available screens if they exist; otherwise leave null placeholders.
const pages: Record<string, React.ComponentType | null> = {
	Dashboard_ProgramDirector: Dashboard_ProgramDirector,
	Dashboard_DevelopmentDirector: Dashboard_DevelopmentDirector,
	Dashboard_HRManager: Dashboard_HRManager,
	Dashboard_BoardSecretary: Dashboard_BoardSecretary,
	Auth_Login: Auth_Login,
	Intake: Intake,
	CaseManagement: CaseManagement,
	Reports: Reports,
	HousingPlacement: null,
	Tasks_Projects: null,
	Training_Compliance: null,
	Notifications: null,
	Settings: null,
	AuditLogs: null,
	Auth_Register: null,
	Auth_Reset: null,
};

export default function DemoGallery() {
	const [key, setKey] = useState<keyof typeof pages>('Dashboard_ProgramDirector');
	// eslint-disable-next-line security/detect-object-injection
	const Page = pages[key];
	const keys = Object.keys(pages) as Array<keyof typeof pages>
	return (
		<div className="min-h-screen bg-[var(--color-surface,#0E0F13)] text-[var(--color-text,#F5F7FA)] p-6">
			<div className="flex gap-2 flex-wrap mb-4 items-center">
				<div className="flex-1">
					{keys.map(k => (
						<button key={k as string} onClick={() => setKey(k)} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 mr-2 mb-2">
							{k}
						</button>
					))}
				</div>
				<div className="relative">
					<NotificationBell />
				</div>
			</div>
			<div className="rounded-lg border border-white/10 p-4">
				{Page ? <Page /> : <div className="opacity-70">Screen scaffold "{key}" not imported yet.</div>}
			</div>
		</div>
	);
}
