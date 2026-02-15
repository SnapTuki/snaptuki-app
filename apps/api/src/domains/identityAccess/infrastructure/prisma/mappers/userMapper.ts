// apps/backend/src/domains/IdentityAccess/infrastructure/prisma/mappers/userMapper.ts

import { User } from '../../../domain/entities/user';
import { Role } from '../../../domain/valueObjects/role.vo';
/**
 * This interface mirrors the Prisma "users" table shape you actually select.
 * It keeps the mapper decoupled from direct Prisma types if you want to unit test it
 * without importing the generated client.
 */
export type PrismaUserRow = {
  userId: string;         // PK in prisma (mapped from "user_id")
  email: string;
  passwordHash: string;   // mapped from "password_hash"
  roles: Role[];
  active: boolean;

  firstName: string | null; // mapped from "first_name"
  lastName: string | null;  // mapped from "last_name"
  agencyId: number | null;  // Int? mapped from "agency_id"

  createdAt: Date;        // "created_at"
  updatedAt: Date;        // "updated_at"
};

/**
 * Map from Prisma row -> Domain aggregate
 */
export const toDomain = (row: PrismaUserRow | null): User | null => {
  if (!row) return null;

  return User.restore({
    userId: row.userId,                 // NOTE: userId maps to domain id
    email: row.email,
    passwordHash: row.passwordHash,
    roles: row.roles as Role[],
    active: row.active,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    firstName: row.firstName ?? undefined,
    lastName: row.lastName ?? undefined,
    agencyId: row.agencyId !== null ? row.agencyId : undefined,
    // ^ Option: If you prefer to keep agencyId as Int in domain, change type there and drop String()
  });
};

/**
 * Map from Domain aggregate -> Prisma create/update payload
 * Keep nullability consistent with schema: use null for optional columns.
 */
export const toPrisma = (user: User): Omit<PrismaUserRow, 'createdAt' | 'updatedAt'> & {
  createdAt?: Date;
  updatedAt?: Date;
} => {
  const s = user.snapshot();

  return {
    userId: s.userId,                       // NOTE: Prisma expects "userId"
    email: s.email,
    passwordHash: s.passwordHash,
    roles: s.roles,
    active: s.active,

    firstName: s.firstName ?? null,
    lastName: s.lastName ?? null,
    agencyId: s.agencyId ? Number(s.agencyId) : null, // convert back to Int? for Prisma

    // createdAt/updatedAt are handled by Prisma defaults, but we pass them when upserting
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
};
``