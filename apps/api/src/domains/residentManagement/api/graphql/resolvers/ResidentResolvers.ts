// src/domains/residentManagement/api/graphql/resolvers/ResidentResolver.ts
import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { ResidentType } from "../types/ResidentTypes";
import {
  RegisterResidentInput,
  UpdateResidentMedicalProfileInput,
  AssignPrimaryCaregiverInput,
  AddResidentAllergyInput,
  AddResidentMedicationInput,
  UpdateResidentContactInput
} from "../inputs/ResidentInputs";

import { PrismaResidentRepo } from "../../../../residentManagement/infrastructure/repos/PrismaResidentRepo";
import { ResidentMap } from "../../../../residentManagement/infrastructure/mappers/ResidentMap";

import { RegisterResidentUseCase } from "../../../../residentManagement/application/useCases/RegisterResidentUseCase";
import { UpdateResidentMedicalProfileUseCase } from "../../../../residentManagement/application/useCases/UpdateResidentMedicalProfileUseCase";
import { AddResidentAllergyUseCase } from "../../../../residentManagement/application/useCases/AddResidentAllergyUseCase";
import { AddResidentMedicationUseCase } from "../../../../residentManagement/application/useCases/AddResidentMedicationUseCase";
import { AssignPrimaryCaregiverUseCase } from "../../../application/useCases/AssignPrimaryCaregiverUsecase";
import {GraphQLContext} from '../../../../../lib/graphqlContext';

@Resolver(() => ResidentType)
export class ResidentResolver {

  @Query(() => [ResidentType])
  async residentList(
    @Ctx('ctx') ctx: GraphQLContext,
    @Arg("search", () => String,{ nullable: true }) search?: string,
    @Arg("mobilityLevel", () => String, { nullable: true }) mobilityLevel?: string,
    
  ): Promise<ResidentType[]> {
    const residents = await ctx.residentManagement.repo.list({ search: search ?? null, mobilityLevel: mobilityLevel ?? null });
    return residents.map(ResidentMap.toDTO) as any;
  }

  @Query(() => ResidentType, { nullable: true })
  async residentById(@Arg("id", () => String) id: string, @Ctx('ctx') ctx: GraphQLContext) {
    const resident = await ctx.residentManagement.repo.getById(id);
    return resident ? (ResidentMap.toDTO(resident) as any) : null;
  }

  @Mutation(() => ResidentType)
  async registerResident(@Arg("input", () => RegisterResidentInput) input: RegisterResidentInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new RegisterResidentUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute({
      id: input.id,
      mrn: input.mrn,
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: input.birthDate,
      gender: input.gender,
      email: input.email ?? null,
      phone: input.phone ?? null,
      mobilityLevel: input.mobilityLevel,
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
  async updateResidentMedicalProfile(@Arg("input", () => UpdateResidentMedicalProfileInput) input: UpdateResidentMedicalProfileInput,
@Ctx() ctx: GraphQLContext) {
    const useCase = new UpdateResidentMedicalProfileUseCase(ctx.residentManagement.repo);
    const resident = await useCase.execute({
      id: input.id,
      mobilityLevel: input.mobilityLevel,
      room: input.room ?? null,
    });
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

}