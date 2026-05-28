// src/domains/caregiverManagement/domain/entities/Caregiver.ts
import { Email } from "../valueObjects/Email";
import { PhoneNumber } from "../valueObjects/PhoneNumber";
import { Certification, CertificationState } from "./Certification";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type StaffRole = "COORDINATOR" | "HEAD_NURSE" | "NURSE" | "PRACTICAL_NURSE" | "DOCTOR";

// 1. Define the Read-Only State Structure (The Snapshot Interface)
export interface StaffState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  phone: string;
  employmentType: EmploymentType;
  birthDate: Date | null;
  hireDate: Date;
  certifications: CertificationState[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StaffProps {
  id: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  email: Email;
  phone: PhoneNumber;
  birthDate?: Date | null;
  employmentType: EmploymentType;
  hireDate: Date;
  certifications: Certification[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Staff {

  private props: StaffProps;

  private constructor(props: StaffProps) {
    this.props = { ...props };
  }

  public static create(props: StaffProps) {
    if (!props.id || !props.firstName || !props.lastName ||
      !props.email) {
      throw new Error("Missing required Caregiver properties");
    }
    return new Staff({
      ...props,
      certifications: props.certifications ?? [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public snapshot(): StaffState {
    return {
      id: this.props.id,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      role: this.props.role,
      email: this.props.email.value,
      phone: this.props.phone.value,
      birthDate: this.props.birthDate ?? null,
      employmentType: this.props.employmentType,
      hireDate: this.props.hireDate,
      certifications: this.props.certifications.map(cert => cert.snapshot()),
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  /**
   * --- REHYDRATION FACTORY: For loading existing staff from Prisma ---
   * Called ONLY by StaffMap
   */
  public static restore(snapshot: StaffState): Staff {
    // We trust the database state completely here. 
    // No new dates are generated, no business rules are triggered.
    return new Staff({
      id: snapshot.id,
      firstName: snapshot.firstName,
      lastName: snapshot.lastName,
      email: Email.create(snapshot.email), 
      phone: PhoneNumber.create(snapshot.phone),
      role: snapshot.role,
      employmentType: snapshot.employmentType,
      hireDate: snapshot.hireDate,
      certifications: snapshot.certifications.map(cert => Certification.restore(cert)), // Assuming Certification also has a restore!
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    });
  }


  public syncIdentityData(firstName: string, lastName: string, email: Email) {
    if (firstName && firstName.trim() != "") this.props.firstName = firstName;

    if (lastName && lastName.trim() != "") this.props.lastName = lastName;

    if (email) this.props.email = email;
  }


  public updateContactDetails(newPhone: PhoneNumber) {
    if (newPhone) this.props.phone = newPhone
  }

}