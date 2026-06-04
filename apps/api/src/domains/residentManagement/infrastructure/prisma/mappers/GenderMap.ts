// src/domains/residentManagement/infrastructure/mappers/GenderMap.ts
import { Gender as DomainGender } from "../../../domain/entities/Resident";
import { Gender as PrismaGender } from "../../../../../generated/prisma";

export const toDomainGender = (prismaGender: PrismaGender): DomainGender => {
  const mapping: Record<PrismaGender, DomainGender> = {
    [PrismaGender.MALE]: DomainGender.MALE,
    [PrismaGender.FEMALE]: DomainGender.FEMALE,
    [PrismaGender.UNSPECIFIED]: DomainGender.UNSPECIFIED,
    [PrismaGender.OTHER]: DomainGender.OTHER
  };

  const mapped = mapping[prismaGender];

  if (!mapped) {
    throw new Error(`Unmapped Gender detected: ${prismaGender}`);
  }

  return mapped;
};