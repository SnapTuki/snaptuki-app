// src/domains/caregiverManagement/api/graphql/resolvers/CaregiverResolver.ts
import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { CaregiverType } from "../types/CaregiverType";
import { RegisterCaregiverInputGql, UpdateCaregiverContactInputGql, AddCaregiverCertificationInputGql } from "../inputs/CreateCaregiverInput";
import { CaregiverMap } from "../../../caregiverManagement/infrastructure/mappers/CaregiverMap";
import { RegisterCaregiverUseCase } from "../../../caregiverManagement/application/useCases/RegisterCaregiverUseCase";
import { UpdateCaregiverContactUseCase } from "../../../caregiverManagement/application/useCases/UpdateCaregiverContactUseCase";
import { DeactivateCaregiverUseCase } from "../../../caregiverManagement/application/useCases/DeactivateCaregiverUseCase";
import { AddCaregiverCertificationUseCase } from "../../../caregiverManagement/application/useCases/AddCaregiverCertificationUseCase";
import { GraphQLContext } from '../../../../lib/graphqlContext';

@Resolver(() => CaregiverType)
export class CaregiverResolver {

    @Query(() => [CaregiverType])
    async caregiverList(@Ctx() ctx: GraphQLContext): Promise<CaregiverType[]> {
        const { repo } = ctx.caregiverManagement;
        const caregivers = await repo.list();
        return caregivers.map(CaregiverMap.toDTO) as any;
    }

    @Query(() => CaregiverType, { nullable: true })
    async caregiverById(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
        const caregiver = await ctx.caregiverManagement.repo.getById(id);
        return caregiver ? (CaregiverMap.toDTO(caregiver) as any) : null;
    }

    @Mutation(() => CaregiverType)
    async registerCaregiver(
        @Arg("input", () => RegisterCaregiverInputGql) input: RegisterCaregiverInputGql,
        @Ctx() ctx: GraphQLContext) {

        const useCase = new RegisterCaregiverUseCase(ctx.caregiverManagement.repo);
        const caregiver = await useCase.execute({
            firstName: input.firstName,
            lastName: input.lastName,
            passwordHash: input.passwordHash,
            email: input.email,
            phone: input.phone ?? null,
            role: input.role,
            employmentType: input.employmentType,
            hireDate: input.hireDate,
            agencyId: input.agencyId ?? null,
        });
        return CaregiverMap.toDTO(caregiver) as any;
    }


    @Mutation(() => CaregiverType)
    async updateCaregiverContact(
        @Arg("input", () => UpdateCaregiverContactInputGql) input: UpdateCaregiverContactInputGql,
        @Ctx() ctx: GraphQLContext
    ) {
        const useCase = new UpdateCaregiverContactUseCase(ctx.caregiverManagement.repo);
        const caregiver = await useCase.execute({
            id: input.id,
            email: input.email,
            phone: input.phone ?? null,
        });
        return CaregiverMap.toDTO(caregiver) as any;
    }

    @Mutation(() => CaregiverType)
    async deactivateCaregiver(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
        const useCase = new DeactivateCaregiverUseCase(ctx.caregiverManagement.repo);
        const caregiver = await useCase.execute(id);
        return CaregiverMap.toDTO(caregiver) as any;
    }

    @Mutation(() => CaregiverType)
    async addCaregiverCertification(
        @Arg("input", () => AddCaregiverCertificationInputGql) input: AddCaregiverCertificationInputGql,
        @Ctx() ctx: GraphQLContext) {
        const useCase = new AddCaregiverCertificationUseCase(ctx.caregiverManagement.repo);
        const caregiver = await useCase.execute({
            caregiverId: input.caregiverId,
            certId: input.certId,
            name: input.name,
            issuer: input.issuer,
            validFrom: input.validFrom.toISOString(),
            validTo: input.validTo ? input.validTo.toISOString() : null,
        });
        return CaregiverMap.toDTO(caregiver) as any;
    }
}