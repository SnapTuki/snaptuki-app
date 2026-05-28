
export type Role = 'SUPER_ADMIN'|'COORDINATOR' | 'DOCTOR' | 'HEAD_NURSE' | 'NURSE' | 'PRACTICAL_NURSE';

export const AllRoles: Role[] = ['SUPER_ADMIN','COORDINATOR', 'DOCTOR', 'HEAD_NURSE', 'NURSE', 'PRACTICAL_NURSE'];

export function assertRole(role: string): asserts role is Role {
  if (!AllRoles.includes(role as Role)) {
    throw new Error(`Invalid role: ${role}`);
  }
}