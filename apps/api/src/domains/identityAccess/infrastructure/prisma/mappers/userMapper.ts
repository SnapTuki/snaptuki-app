// apps/backend/src/domains/identityAccess/infrastructure/prisma/mappers/UserMap.ts

import { User } from '../../../domain/entities/user';
import { Role } from '../../../domain/valueObjects/role.vo';

/**
 * Mirrors the Prisma "users" table shape.
 */
export type PrismaUserRow = {
  userId: string;
  email: string;
  passwordHash: string;
  roles: string[]; 
  active: boolean;
  firstName: string; 
  lastName: string;  
  agencyId: number | null; 
  createdAt: Date;
  updatedAt: Date;
};

export class UserMap {
  /**
   * 1. INFRASTRUCTURE -> DOMAIN (Read)
   */
  static toDomain(row: PrismaUserRow | null): User | null {
    if (!row) return null;

    return User.restore({
      userId: row.userId,
      email: row.email,
      passwordHash: row.passwordHash,
      roles: row.roles as Role[], 
      active: row.active,
      firstName: row.firstName,
      lastName: row.lastName,
      agencyId: row.agencyId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  /**
   * 2. DOMAIN -> INFRASTRUCTURE (Write)
   */
  static toPrisma(user: User) {
    const state = user.snapshot();

    return {
      userId: state.userId,
      email: state.email,
      passwordHash: state.passwordHash,
      roles: state.roles,
      active: state.active,
      firstName: state.firstName,
      lastName: state.lastName,
      agencyId: state.agencyId, 
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  }

  /**
   * 3. DOMAIN -> PRESENTATION (API)
   * CRITICAL: Explicitly strips out the passwordHash!
   */
  static toDTO(user: User) {
    const state = user.snapshot();

    return {
      id: state.userId,
      email: state.email,
      firstName: state.firstName,
      lastName: state.lastName,
      roles: state.roles,
      active: state.active,
      agencyId: state.agencyId,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  }
}