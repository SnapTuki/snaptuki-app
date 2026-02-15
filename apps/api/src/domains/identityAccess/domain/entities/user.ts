// IdentityAccess/domain/entities/UserAccount.ts
import { Email } from '../valueObjects/email.vo';
import { Role, assertRole } from '../valueObjects/role.vo';

export class User {
  private constructor(
    public readonly userId: string,      // NOTE: userId (not generic id)
    private _email: Email,
    private _passwordHash: string,
    private _roles: Set<Role>,
    private _active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    private _firstName?: string,
    private _lastName?: string,
    private _agencyId?: number           // keep as number to match Prisma Int?
  ) {}

  static createNew(params: {
    userId: string;
    email: Email;
    passwordHash: string;
    roles?: Role[];
    active?: boolean;
    now?: Date;
    firstName?: string;
    lastName?: string;
    agencyId?: number;
  }): User {
    const now = params.now ?? new Date();
    const roles = new Set<Role>(params.roles?.length ? params.roles : ['AGENCY_STAFF']);
    return new User(
      params.userId,
      params.email,
      params.passwordHash,
      roles,
      params.active ?? true,
      now,
      now,
      params.firstName?.trim() || undefined,
      params.lastName?.trim() || undefined,
      params.agencyId
    );
  }

  static restore(snapshot: {
    userId: string;
    email: string;
    passwordHash: string;
    roles: Role[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    firstName?: string | null;
    lastName?: string | null;
    agencyId?: number | null;
  }): User {
    snapshot.roles.forEach(assertRole);
    return new User(
      snapshot.userId,
      Email.create(snapshot.email),
      snapshot.passwordHash,
      new Set(snapshot.roles),
      snapshot.active,
      new Date(snapshot.createdAt),
      new Date(snapshot.updatedAt),
      snapshot.firstName ?? undefined,
      snapshot.lastName ?? undefined,
      snapshot.agencyId ?? undefined
    );
  }

  // getters
  get email() { return this._email.toString(); }
  get passwordHash() { return this._passwordHash; }
  get roles(): Role[] { return Array.from(this._roles.values()); }
  get active() { return this._active; }
  get firstName() { return this._firstName; }
  get lastName() { return this._lastName; }
  get agencyId() { return this._agencyId; }

  // behaviors
  assignRole(role: Role) { this._roles.add(role); }
  revokeRole(role: Role) { this._roles.delete(role); }
  deactivate() { this._active = false; }
  activate() { this._active = true; }
  changePasswordHash(newHash: string) { this._passwordHash = newHash; }
  setName(first?: string, last?: string) {
    this._firstName = first?.trim() || undefined;
    this._lastName = last?.trim() || undefined;
  }
  setAgency(agencyId?: number) { this._agencyId = agencyId; }

  snapshot() {
    return {
      userId: this.userId,
      email: this.email,
      passwordHash: this._passwordHash,
      roles: this.roles,
      active: this._active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      firstName: this._firstName,
      lastName: this._lastName,
      agencyId: this._agencyId,
    };
  }
}