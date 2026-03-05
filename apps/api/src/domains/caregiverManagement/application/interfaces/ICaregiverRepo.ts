// src/domains/caregiverManagement/application/interfaces/ICaregiverRepo.ts
import { Caregiver } from "../../domain/entities/Caregiver";

export interface ICaregiverRepo {
  getById(id: string): Promise<Caregiver | null>;
  getByEmail(email: string): Promise<Caregiver | null>;
  list(params?: { take?: number; skip?: number; search?: string | null; role?: string | null; status?: string | null }): Promise<Caregiver[]>;
  create(caregiver: Caregiver): Promise<void>;
  save(caregiver: Caregiver): Promise<void>;
  delete(id: string): Promise<void>;
}