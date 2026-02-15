import { registerEnumType } from 'type-graphql';

// Keep in sync with your Role VO / Prisma enum
export enum RoleGQL {
  SUPER_ADMIN = 'SUPER_ADMIN',
  AGENCY_STAFF = 'AGENCY_STAFF',
  SUPERVISOR = 'SUPERVISOR',
  CAREGIVER = 'CAREGIVER',
}

registerEnumType(RoleGQL, { name: 'Role' });