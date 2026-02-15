// IdentityAccess/application/dto/UserDTOs.ts
import { Role } from "../../domain/valueObjects/role.vo";

export type UserView = {
  userId: string;
  email: string;
  roles: Role[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  firstName?: string | null;
  lastName?: string | null;
  agencyId?: number | null;
};

export function toUserView(u: {
  userId: string;
  email: string;
  roles: Role[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  agencyId?: number;
}): UserView {
  return {
    userId: u.userId,
    email: u.email,
    roles: u.roles,
    active: u.active,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    firstName: u.firstName ?? null,
    lastName: u.lastName ?? null,
    agencyId: u.agencyId ?? null,
  };
}