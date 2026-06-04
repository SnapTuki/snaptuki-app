import { MobilityLevel as PrismaMobilityLevel } from "../../../../../generated/prisma";
import { MobilityLevel as DomainMobilityLevel } from "../../../domain/entities/Resident";

export const toDomainMobilityLevel = (prismaMobilityLevel: PrismaMobilityLevel): DomainMobilityLevel => {
  const mapping: Record<PrismaMobilityLevel, DomainMobilityLevel> = {
    [PrismaMobilityLevel.INDEPENDENT]: DomainMobilityLevel.Independent,
    [PrismaMobilityLevel.ASSISTED]: DomainMobilityLevel.Assisted,
    [PrismaMobilityLevel.MEMORY]: DomainMobilityLevel.Memory,
  };

  const mapped = mapping[prismaMobilityLevel];

  if (!mapped) {
    throw new Error(`Unmapped MobilityLevel detected: ${prismaMobilityLevel}`);
  }

  return mapped;
};