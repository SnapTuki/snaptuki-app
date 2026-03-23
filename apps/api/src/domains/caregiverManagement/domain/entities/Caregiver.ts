// src/domains/caregiverManagement/domain/entities/Caregiver.ts
import { Name } from "../valueObjects/Name";
import { Email } from "../valueObjects/Email";
import { PhoneNumber } from "../valueObjects/PhoneNumber";
import { Certification } from "./Certification";

export type CaregiverRole = "CAREGIVER" | "HEAD_NURSE" | "COORDINATOR";
export type CaregiverStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export interface CaregiverProps {
  firstName: string;
  lastName: string;
  email: Email;
  passwordHash: string
  phone: PhoneNumber | null;
  role: CaregiverRole;
  status: CaregiverStatus;
  employmentType: EmploymentType;
  hireDate: Date;
  userId?: string | null;
  certifications: Certification[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Caregiver {
  // NOTE: we keep props private to protect invariants.
  // If you need to set userId after creation, do it via a dedicated behavior.
  private props: CaregiverProps;

  private constructor(props: CaregiverProps) {
    this.props = { ...props };
  }

  public static create(props: CaregiverProps) {
    if (!props.firstName || !props.lastName ||
         !props.email || !props.passwordHash|| !props.role || !props.status ||
          !props.employmentType || !props.hireDate) {
      throw new Error("Missing required Caregiver properties");
    }
    return new Caregiver({ ...props, certifications: props.certifications ?? [] });
  }

  // getters
  public get firstName() { return this.props.firstName; }
  public get lastName() {return this.props.lastName;}
  public get email() { return this.props.email; }
  public get passwordHash() { return this.props.passwordHash; }
  public get phone() { return this.props.phone; }
  public get role() { return this.props.role; }
  public get status() { return this.props.status; }
  public get employmentType() { return this.props.employmentType; }
  public get hireDate() { return this.props.hireDate; }
  public get userId() { return this.props.userId ?? null; }
  public get certifications() { return [...this.props.certifications]; }
  public get createdAt() { return this.props.createdAt ?? new Date(); }
  public get updatedAt() { return this.props.updatedAt ?? new Date(); }

  // behaviors
  public changeContact(email: Email, phone: PhoneNumber | null) {
    this.props.email = email;
    this.props.phone = phone;
  }

  public deactivate() {
    if (this.props.status === "INACTIVE") return;
    this.props.status = "INACTIVE";
  }

  public suspend() {
    this.props.status = "SUSPENDED";
  }

  public activate() {
    this.props.status = "ACTIVE";
  }

  public addCertification(cert: Certification) {
    const exists = this.props.certifications.find(c => c.id === cert.id);
    if (!exists) this.props.certifications.push(cert);
  }

  public linkUser(userId: string) {
    this.props.userId = userId;
  }
}