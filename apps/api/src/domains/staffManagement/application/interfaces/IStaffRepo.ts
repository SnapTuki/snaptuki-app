// src/domains/caregiverManagement/application/interfaces/ICaregiverRepo.ts
import { Staff } from "../../domain/entities/Staff";

export interface IStaffRepo {
  getById(id: string): Promise<Staff | null>;
  getByEmail(email: string): Promise<Staff | null>;
  list(params?: { take?: number; skip?: number; search?: string | null; role?: string | null; status?: string | null }): Promise<Staff[]>;
  create(caregiver: Staff): Promise<void>;
  save(caregiver: Staff): Promise<void>;
  delete(id: string): Promise<void>;
}