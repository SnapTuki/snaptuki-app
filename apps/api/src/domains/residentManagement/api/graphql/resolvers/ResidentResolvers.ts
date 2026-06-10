// src/domains/residentManagement/api/graphql/resolvers/ResidentResolver.ts

import { Resolver, Query, Mutation, Arg, Root, Ctx } from "type-graphql";
import { ResidentType } from "../types/ResidentTypes";
import { FieldResolver } from "type-graphql";
import { TaskType } from "../../../../taskManagement/api/graphql/types/TaskTypes";
import {
  RegisterResidentInput,
  AddResidentAllergyInput,
  AddResidentMedicationInput,
  EmergencyContactInput,
  UpdateResidentIdentityInput,
} from "../inputs/ResidentInputs";

import { ResidentMap } from "../../../../residentManagement/infrastructure/prisma/mappers/ResidentMap";
import { GraphQLContext } from '../../../../../lib/graphqlContext';

import { RegisterResidentUseCase } from "../../../../residentManagement/application/useCases/RegisterResidentUseCase";
import { AddResidentAllergyUseCase } from "../../../../residentManagement/application/useCases/AddResidentAllergyUseCase";
import { AddResidentMedicationUseCase } from "../../../../residentManagement/application/useCases/AddResidentMedicationUseCase";
import { DischargeResidentUseCase } from "../../../application/useCases/DischargeResidentUseCase";
import { UpdateResidentIdentityUseCase } from "../../../application/useCases/UpdateResidentIdentityUseCase";
import { UpdateEmergencyContactsUseCase } from "../../../application/useCases/UpdateEmergencyContactsUseCase";
import { ListResidentsUseCase } from "../../../application/useCases/ListResidentsUseCase";
import { MobilityLevel } from "../../../domain/entities/Resident";
import { FindAllTasksUseCase } from "../../../../taskManagement/application/useCases/FindAllTasksUseCase";
import { GetResidentProfileUseCase } from "../../../application/useCases/GetResidentProfileUseCase";


@Resolver(() => ResidentType)
export class ResidentResolver {

  @Query(() => [ResidentType])
  async residentList(
    @Ctx() ctx: GraphQLContext,
    @Arg("search", () => String, { nullable: true }) search?: string,
    @Arg("mobilityLevel", () => MobilityLevel, { nullable: true }) mobilityLevel?: MobilityLevel,
  ): Promise<ResidentType[]> {

    const useCase = new ListResidentsUseCase(ctx.residentManagement.repo);
    // The Use Case returns { residents: ResidentDTO[] }
    const result = await useCase.execute({
      search: search ?? null,
      mobilityLevel: mobilityLevel ?? null
    });

    console.log(result)

    // Return the pre-mapped DTOs directly!
    return result.residents; 
  }

  @Query(() => ResidentType, { nullable: true })
  async getResidentById(@Arg("residentId", () => String) residentId: string, @Ctx() ctx: GraphQLContext) {

    const useCase = new GetResidentProfileUseCase(ctx.residentManagement.repo);
    const resident = useCase.execute(residentId);
    console.log("REsident Details from resolver: ", resident)
    return resident;
  }

  @Mutation(() => ResidentType)
  async registerResident(@Arg("input", () => RegisterResidentInput) input: RegisterResidentInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new RegisterResidentUseCase(ctx.residentManagement.repo);
    
    // Domain handles 'status' internally, and inputs map perfectly to Domain Enums now
    const result = await useCase.execute({
      agencyId: input.agencyId,
      firstName: input.firstName,
      lastName: input.lastName,
      ssn: input.ssn,
      birthDate: input.birthDate,
      gender: input.gender, 
      emergencyContacts: input.emergencyContacts,
      mobilityLevel: input.mobilityLevel,
      room: input.room ?? null,
    });

    return result.resident;
  }

  @Mutation(() => ResidentType)
  async dischargeResident(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
    const useCase = new DischargeResidentUseCase(ctx.residentManagement.repo);
    const result = await useCase.execute(id);
    return result.resident;
  }

  @Mutation(() => ResidentType)
  async addResidentAllergy(@Arg("input", () => AddResidentAllergyInput) input: AddResidentAllergyInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new AddResidentAllergyUseCase(ctx.residentManagement.repo);
    const result = await useCase.execute({
      residentId: input.residentId,
      // 'id' is omitted; the Use Case generates it securely!
      name: input.name,
      reaction: input.reaction,
      severity: input.severity,
      notes: input.notes ?? null,
    });
    return result.resident;
  }

  @Mutation(() => ResidentType)
  async addResidentMedication(@Arg("input", () => AddResidentMedicationInput) input: AddResidentMedicationInput, @Ctx() ctx: GraphQLContext) {
    const useCase = new AddResidentMedicationUseCase(ctx.residentManagement.repo);
    const result = await useCase.execute({
      residentId: input.residentId,
      // 'id' is omitted; the Use Case generates it securely!
      name: input.name,
      dosage: input.dosage,
      frequency: input.frequency,
      startDate: input.startDate.toISOString(), // Serialize Date object to string for the Use Case
      endDate: input.endDate ? input.endDate.toISOString() : null,
      prescribedBy: input.prescribedBy ?? null,
    });
    return result.resident;
  }

  @Mutation(() => ResidentType)
  async updateResidentIdentity(
    @Arg("input", () => UpdateResidentIdentityInput) input: UpdateResidentIdentityInput,
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new UpdateResidentIdentityUseCase(ctx.residentManagement.repo);
    const result = await useCase.execute(input);
    return result.resident;
  }

  @Mutation(() => ResidentType)
  async updateEmergencyContacts(
    @Arg("residentId", () => String) residentId: string,
    @Arg("contacts", () => [EmergencyContactInput]) contacts: EmergencyContactInput[],
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new UpdateEmergencyContactsUseCase(ctx.residentManagement.repo);
    const result = await useCase.execute(residentId, contacts);
    return result.resident;
  }


  @FieldResolver(() => [TaskType])
  async tasks(
    @Root() resident: ResidentType, // <--- Access the parent Resident object
    @Ctx() ctx: GraphQLContext,
    @Arg("status", () => String, { nullable: true }) status?: string,
    @Arg("limit", () => Number, { nullable: true, defaultValue: 50 }) limit?: number,
    
  ): Promise<TaskType[]> {
    
    // Executes logic entirely within the Task Management BC, 
    // passing the Resident's ID as the connecting parameter.
    const taskUseCase = new FindAllTasksUseCase(ctx.taskManagement.repo)
    const result = await taskUseCase.execute({
      residentId: resident.residentId, 
    });

    return result;
  }
}