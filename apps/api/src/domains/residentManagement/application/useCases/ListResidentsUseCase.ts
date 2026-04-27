import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident } from "../../domain/entities/Resident";
import { MobilityLevel } from "../../domain/entities/Resident";

export interface ListResidentsInput {
  search?: string | null;
  mobilityLevel?: string | null;
}

export class ListResidentsUseCase {
  constructor(private readonly residentRepo: IResidentRepo) {}

  async execute(input: ListResidentsInput): Promise<Resident[]> {
    // Business logic for filtering/authorization could be added here
    console.log("Executing use case list resident ")
    const residents = await this.residentRepo.list({
      search: input.search ?? null,
      careLevel: input.mobilityLevel as MobilityLevel ?? null,
    });

    console.log("Use case Resident returns ", residents)
    return residents;
  }
}