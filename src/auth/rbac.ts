export type Action = 'read'|'create'|'update'|'delete'|'manage';
export type Scope =
  | 'accounts'|'users'|'roles'
  | 'programs'|'participants'|'services'
  | 'cases'|'clinical_notes'|'housing'
  | 'tasks'|'training'|'compliance'
  | 'fundraising'|'donors'|'campaigns'|'grants'|'events'
  | 'volunteers'|'hr'|'payroll'
  | 'reports'|'billing'
  | 'notifications'|'settings'|'audit_logs'
  | 'governance'|'board_meetings'|'esign';

export enum Role {
  SUPER_ADMIN='SUPER_ADMIN', ADMIN='ADMIN',
  CEO='CEO', COO='COO', CFO='CFO',
  BOARD_MEMBER='BOARD_MEMBER', BOARD_SECRETARY='BOARD_SECRETARY',
  PROGRAM_DIRECTOR='PROGRAM_DIRECTOR', HR_MANAGER='HR_MANAGER',
  DEVELOPMENT_DIRECTOR='DEVELOPMENT_DIRECTOR', GRANTS_MANAGER='GRANTS_MANAGER',
  SUPERVISOR='SUPERVISOR', CASE_WORKER='CASE_WORKER', SOCIAL_WORKER='SOCIAL_WORKER',
  INTAKE_SPECIALIST='INTAKE_SPECIALIST', HOUSING_SPECIALIST='HOUSING_SPECIALIST',
  RECEPTIONIST='RECEPTIONIST', VOLUNTEER='VOLUNTEER', CLIENT='CLIENT',
}

type PermissionMap = Partial<Record<Role, Partial<Record<Scope, Action[]>>>>;

export const PERMISSIONS: PermissionMap = {
  [Role.SUPER_ADMIN]: {
    accounts:['manage'], users:['manage'], roles:['manage'],
    programs:['manage'], participants:['manage'], services:['manage'],
    cases:['manage'], clinical_notes:['manage'], housing:['manage'],
    tasks:['manage'], training:['manage'], compliance:['manage'],
    fundraising:['manage'], donors:['manage'], campaigns:['manage'], grants:['manage'], events:['manage'],
    volunteers:['manage'], hr:['manage'], payroll:['manage'],
    reports:['manage'], billing:['manage'],
    notifications:['manage'], settings:['manage'], audit_logs:['manage'],
    governance:['manage'], board_meetings:['manage'], esign:['manage'],
  },
  [Role.ADMIN]: { users:['read','update','delete'], roles:['manage'], settings:['manage'], reports:['read'], audit_logs:['read'] },
  [Role.BOARD_SECRETARY]: { governance:['manage'], board_meetings:['manage'], esign:['manage'], reports:['read'], audit_logs:['read'], settings:['read'] },
  [Role.CEO]: { reports:['manage'], billing:['read'], settings:['read'] },
  [Role.COO]: { programs:['manage'], cases:['manage'], tasks:['manage'], reports:['read'] },
  [Role.CFO]: { billing:['manage'], reports:['manage'] },
  [Role.BOARD_MEMBER]: { reports:['read'], audit_logs:['read'] },
  [Role.PROGRAM_DIRECTOR]: { programs:['manage'], participants:['manage'], services:['manage'], cases:['read','update'], tasks:['manage'], training:['manage'], reports:['read'] },
  [Role.HR_MANAGER]: { hr:['manage'], payroll:['manage'], training:['manage'], compliance:['read'], users:['read','update'] },
  [Role.DEVELOPMENT_DIRECTOR]: { fundraising:['manage'], donors:['manage'], campaigns:['manage'], events:['manage'], grants:['read'], reports:['read'] },
  [Role.GRANTS_MANAGER]: { grants:['manage'], reports:['manage'], donors:['read'], campaigns:['read'] },
  [Role.SUPERVISOR]: { cases:['manage'], tasks:['manage'], training:['manage'], reports:['read'] },
  [Role.CASE_WORKER]: { cases:['manage'], tasks:['manage'], notifications:['read'], participants:['update'] },
  [Role.SOCIAL_WORKER]: { clinical_notes:['manage'], participants:['update'] },
  [Role.INTAKE_SPECIALIST]: { participants:['create','read','update'], services:['read'], cases:['create'] },
  [Role.HOUSING_SPECIALIST]: { housing:['manage'], cases:['update'], participants:['read'] },
  [Role.RECEPTIONIST]: { participants:['read'], events:['create'], tasks:['create'] },
  [Role.VOLUNTEER]: { tasks:['read','update'], training:['read'] },
  [Role.CLIENT]: { participants:['update'], notifications:['read'] },
};

export function can(roleOrRoles: Role|Role[], scope: Scope, action: Action) {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  return roles.some(r => {
    const allowed = PERMISSIONS[r]?.[scope];
    if (!allowed) return false;
    if (allowed.includes('manage')) return true;
    return allowed.includes(action);
  });
}
