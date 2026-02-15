// IdentityAccess/domain/value-objects/Role.ts
// Role VO reflects your Prisma enum ROLE (now includes SUPERVISOR).

export type Role = 'SUPER_ADMIN' | 'AGENCY_STAFF' | 'SUPERVISOR' | 'CAREGIVER';

export const AllRoles: Role[] = ['SUPER_ADMIN', 'AGENCY_STAFF', 'SUPERVISOR', 'CAREGIVER'];

export function assertRole(role: string): asserts role is Role {
  if (!AllRoles.includes(role as Role)) {
    throw new Error(`Invalid role: ${role}`);
  }
}