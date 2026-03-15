// src/domains/residentManagement/application/interfaces/IResidentRepo.ts
import { Resident } from "../../domain/entities/Resident";

export interface IResidentRepo {
  getById(id: string): Promise<Resident | null>;
  getByMRN(mrn: string): Promise<Resident | null>;
  list(params?: { take?: number; skip?: number; search?: string | null; status?: string | null; careLevel?: string | null }): Promise<Resident[]>;
  create(resident: Resident): Promise<void>;
  save(resident: Resident): Promise<void>;
  delete(id: string): Promise<void>;
}