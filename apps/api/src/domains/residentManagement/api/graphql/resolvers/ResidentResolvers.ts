// src/domains/residentManagement/api/graphql/resolvers/ResidentResolver.ts
import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { ResidentType } from "../types/ResidentTypes";
import {
  RegisterResidentInput,
  UpdateResidentMedicalProfileInput,
  AssignPrimaryCaregiverInput,
  AddResidentAllergyInput,
  AddResidentMedicationInput,
  EmergencyContactInput,
  UpdateResidentIdentityInput,
} from "../inputs/ResidentInputs";

import { ResidentMap } from "../../../../residentManagement/infrastructure/mappers/ResidentMap";

import { RegisterResidentUseCase } from "../../../../residentManagement/application/useCases/RegisterResidentUseCase";
import { AddResidentAllergyUseCase } from "../../../../residentManagement/application/useCases/AddResidentAllergyUseCase";
import { AddResidentMedicationUseCase } from "../../../../residentManagement/application/useCases/AddResidentMedicationUseCase";
import { AssignPrimaryCaregiverUseCase } from "../../../application/useCases/AssignPrimaryCaregiverUsecase";
import { GraphQLContext } from '../../../../../lib/graphqlContext';
import { DischargeResidentUseCase } from "../../../application/useCases/DischargeResidentUseCase";
import { UpdateResidentIdentityUseCase } from "../../../application/useCases/UpdateResidentIdentityUseCase";
import { UpdateEmergencyContactsUseCase } from "../../../application/useCases/UpdateEmergencyContactsUseCase";
import { ListResidentsUseCase } from "../../../application/useCases/ListResidentsUseCase";
import { toDomainGender } from "../../../infrastructure/mappers/GenderMap";
import { toDomainResidentStatus } from "../../../infrastructure/mappers/ResidentStatusMap";
import { toDomainMobilityLevel } from "../../../infrastructure/mappers/MobilityLevelMap";
import { MobilityLevel } from "../../../domain/entities/Resident";

@Resolver()
export class ResidentResolver {

  @Query(() => [ResidentType])
  async residentList(
    @Ctx() ctx: GraphQLContext,
    @Arg("search", () => String, { nullable: true }) search?: string,
    @Arg("mobilityLevel", () => MobilityLevel, { nullable: true }) mobilityLevel?: MobilityLevel,

  ): Promise<ResidentType[]> {
    
    const useCase = new ListResidentsUseCase(ctx.residentManagement.repo);
    console.log('Query residentList is called ');
    const residents = await useCase.execute({
      search: search ?? null,
      mobilityLevel: mobilityLevel ?? null
    });

    return residents.map(resident => ResidentMap.toDTO(resident));
  }

  @Query(() => ResidentType, { nullable: true })
  async getResidentById(@Arg("residentId", () => String) residentId: string, @Ctx() ctx: GraphQLContext) {
    const resident = await ctx.residentManagement.repo.getById(residentId);
    console.log(resident)
    return resident ? (ResidentMap.toDTO(resident) as any) : null;
  }

  @Mutation(() => ResidentType)
  async registerResident(@Arg("input", () => RegisterResidentInput) input: RegisterResidentInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new RegisterResidentUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute({
      agencyId: input.agencyId,
      mrn: input.mrn,
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: input.birthDate,
      gender: toDomainGender(input.gender),
      status: toDomainResidentStatus("ACTIVE"),
      email: input.email ?? null,
      phone: input.phone ?? null,
      mobilityLevel: toDomainMobilityLevel(input.mobilityLevel),
      room: input.room ?? null,
    });
    return ResidentMap.toDTO(resident) as any;
  }


  //   @Authorized("HEAD_NURSE", "COORDINATOR")
  //   @Mutation(() => ResidentType)
  //   async updateResidentContact(@Arg("input") input: UpdateResidentContactInput, @Ctx() ctx: GraphQLContext) {
  //     const useCase = new UpdateResidentContactUseCase(ctx.residentManagement.repo);
  //     const resident = await useCase.execute({
  //       id: input.id,
  //       email: input.email ?? null,
  //       phone: input.phone ?? null,
  //     });
  //     return ResidentMap.toDTO(resident) as any;
  //   }


  @Mutation(() => ResidentType)
  async dischargeResident(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
    const useCase = new DischargeResidentUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute(id);
    console.log("Dischargied : " + resident.status);
    return ResidentMap.toDTO(resident) as any;
  }


  @Mutation(() => ResidentType)
  async assignPrimaryCaregiver(@Arg("input", () => AssignPrimaryCaregiverInput) input: AssignPrimaryCaregiverInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new AssignPrimaryCaregiverUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute(input.residentId, input.caregiverId);
    return ResidentMap.toDTO(resident) as any;
  }

  @Mutation(() => ResidentType)
  async addResidentAllergy(@Arg("input", () => AddResidentAllergyInput) input: AddResidentAllergyInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new AddResidentAllergyUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute({
      residentId: input.residentId,
      id: input.id,
      name: input.name,
      reaction: input.reaction,
      severity: input.severity,
      notes: input.notes ?? null,
    });
    return ResidentMap.toDTO(resident) as any;
  }

  @Mutation(() => ResidentType)
  async addResidentMedication(@Arg("input", () => AddResidentMedicationInput) input: AddResidentMedicationInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new AddResidentMedicationUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute({
      residentId: input.residentId,
      id: input.id,
      name: input.name,
      dosage: input.dosage,
      frequency: input.frequency,
      startDate: input.startDate.toISOString(),
      endDate: input.endDate ? input.endDate.toISOString() : null,
      prescribedBy: input.prescribedBy ?? null,
    });
    return ResidentMap.toDTO(resident) as any;
  }

  @Mutation(() => ResidentType)
  async updateResidentIdentity(
    @Arg("input", () => UpdateResidentIdentityInput) input: UpdateResidentIdentityInput,
    @Ctx() ctx: GraphQLContext
  ) {
    // Logic: Name, DOB, SSN changes
    const useCase = new UpdateResidentIdentityUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute(input);
    return ResidentMap.toDTO(resident);
  }

  @Mutation(() => ResidentType)
  async updateEmergencyContacts(
    @Arg("residentId", () => String) residentId: string,
    @Arg("contacts", () => [EmergencyContactInput]) contacts: EmergencyContactInput[],
    @Ctx() ctx: GraphQLContext
  ) {
    console.log('Calling updateEmergencyContacts with parameters: ', contacts)
    // Logic: Replaces or syncs the contact list
    const useCase = new UpdateEmergencyContactsUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute(residentId, contacts);
    console.log("Resident from emergency update: ", resident.emergencyContacts);
    return ResidentMap.toDTO(resident);
  }

}