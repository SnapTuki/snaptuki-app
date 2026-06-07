// src/domains/residentManagement/application/interfaces/IResidentRepo.ts
import { Resident } from "../../domain/entities/Resident";

export interface IResidentRepo {
  getById(id: string): any;
  getByMRN(mrn: string): any;
  list(params?: { take?: number; skip?: number; search?: string | null; status?: string | null; careLevel?: string | null }): any;
  save(resident: Resident): Promise<void>;
  delete(id: string): Promise<void>;
}