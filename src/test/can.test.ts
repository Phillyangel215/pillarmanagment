/// <reference types="vitest" />
import { can, Role } from '@/auth/rbac';

describe('RBAC can()', () => {
  it('SUPER_ADMIN can create accounts', () => {
    expect(can(Role.SUPER_ADMIN, 'accounts', 'create')).toBe(true);
  });
  it('ADMIN cannot create accounts', () => {
    expect(can(Role.ADMIN, 'accounts', 'create')).toBe(false);
  });
  it('BOARD_SECRETARY manages governance', () => {
    expect(can(Role.BOARD_SECRETARY, 'governance', 'manage')).toBe(true);
  });
  it('multi-role union works', () => {
    const roles = [Role.ADMIN, Role.BOARD_SECRETARY];
    expect(can(roles, 'board_meetings', 'manage')).toBe(true);
    expect(can(roles, 'accounts', 'create')).toBe(false);
  });
});
