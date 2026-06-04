import { ResidentStatus as PrismaResidentStatus } from "../../../../../generated/prisma";
import { ResidentStatus as DomainStatus } from "../../../domain/entities/Resident";

export const toDomainResidentStatus = (prismaStatus: PrismaResidentStatus): DomainStatus => {
  const mapping: Record<PrismaResidentStatus, DomainStatus> = {
    [PrismaResidentStatus.ACTIVE]: DomainStatus.Active,
    [PrismaResidentStatus.DISCHARGED]: DomainStatus.Discharged,
  };

  const mapped = mapping[prismaStatus];

  if (!mapped) {
    throw new Error(`Unmapped ResidentStatus detected: ${prismaStatus}`);
  }

  return mapped;
};