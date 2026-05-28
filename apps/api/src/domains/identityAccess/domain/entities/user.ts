// src/domains/identityAccess/domain/entities/User.ts
import { Email } from '../valueObjects/email.vo';
import { Role, assertRole } from '../valueObjects/role.vo';

// 1. Explicit Read-Only State Representation (The Snapshot)
export interface UserState {
  userId: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  active: boolean;
  agencyId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Internal Encapsulated Domain Properties
interface UserProps {
  userId: string;
  email: Email;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roles: Set<Role>;
  active: boolean;
  agencyId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = { ...props };
  }

  /**
   * --- DOMAIN FACTORY: For creating completely new users ---
   */
  public static createNew(params: {
    userId: string; // The orchestrator must generate and pass this CUID/UUID
    email: Email;
    passwordHash: string;
    firstName: string; // Mandatory!
    lastName: string;  // Mandatory!
    roles?: Role[];
    agencyId?: number | null;
  }): User {
    if (!params.firstName.trim() || !params.lastName.trim()) {
      throw new Error("First name and last name are required.");
    }

    const now = new Date();
    const initialRoles = params.roles?.length ? params.roles : ['COORDINATOR'] as Role[];
    
    // Ensure all provided roles are valid
    initialRoles.forEach(assertRole);

    return new User({
      userId: params.userId,
      email: params.email,
      passwordHash: params.passwordHash,
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      roles: new Set<Role>(initialRoles),
      active: true, // Always active upon creation
      agencyId: params.agencyId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * --- REHYDRATION FACTORY: For the Infrastructure Mapper ---
   */
  public static restore(snapshot: UserState): User {
    snapshot.roles.forEach(assertRole);
    
    return new User({
      userId: snapshot.userId,
      // Assuming your Email VO has a .create() or equivalent factory
      email: Email.create ? Email.create(snapshot.email) : (snapshot.email as any), 
      passwordHash: snapshot.passwordHash,
      firstName: snapshot.firstName,
      lastName: snapshot.lastName,
      roles: new Set(snapshot.roles),
      active: snapshot.active,
      agencyId: snapshot.agencyId,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    });
  }

  /**
   * --- THE SNAPSHOT PATTERN ---
   * Completely replaces all `get` accessors.
   */
  public snapshot(): UserState {
    return {
      userId: this.props.userId,
      email: this.props.email.toString(), // or .getValue(), depending on your VO
      passwordHash: this.props.passwordHash,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      roles: Array.from(this.props.roles),
      active: this.props.active,
      agencyId: this.props.agencyId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  /**
   * --- FULL DOMAIN BEHAVIORS ---
   */

  public assignRole(role: Role): void {
    assertRole(role);
    if (!this.props.roles.has(role)) {
      this.props.roles.add(role);
      this.thisTrackUpdate();
    }
  }

  public deactivate(): void {
    if (!this.props.active) return;
    this.props.active = false;
    this.thisTrackUpdate();
  }

  public activate(): void {
    if (this.props.active) return;
    this.props.active = true;
    this.thisTrackUpdate();
  }

  public changePasswordHash(newHash: string): void {
    if (!newHash.trim()) throw new Error("Password hash cannot be empty.");
    this.props.passwordHash = newHash;
    this.thisTrackUpdate();
  }

  public updateIdentityDetails(firstName: string, lastName: string): void {
    if (!firstName.trim() || !lastName.trim()) {
      throw new Error("First name and last name cannot be empty.");
    }
    this.props.firstName = firstName.trim();
    this.props.lastName = lastName.trim();
    this.thisTrackUpdate();
  }

  public setAgency(agencyId: number | null): void {
    this.props.agencyId = agencyId;
    this.thisTrackUpdate();
  }

  public changeAccountEmail(email: string): boolean{
    const newEmail = Email.create(email);
    if(!newEmail){
      throw new Error("Email cannot be created/changed")
    }

    this.props.email = newEmail;
    return true;
  }

  /**
   * Automatically ticks the updatedAt timestamp on any state mutation.
   */
  private thisTrackUpdate(): void {
    this.props.updatedAt = new Date();
  }
}