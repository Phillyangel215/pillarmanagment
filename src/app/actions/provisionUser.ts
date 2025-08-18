import { provisionUser } from '@/features/admin/useProvisionUser'

export async function submitProvisionUser(email: string, password: string, roles: string[]) {
  return provisionUser({ email, password, roles })
}

