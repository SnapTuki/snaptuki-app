import { PrismaClient } from "@prisma/client";
import { MobilityLevel } from "../../generated/prisma";

export class ElderProfileService {
  private dbClient: PrismaClient;

  constructor(db: PrismaClient) {
    this.dbClient = db;
  }

  /* ---------------- READ ---------------- */

  async getElderById(elderId: number) {
    return this.dbClient.elderProfile.findUnique({
      where: { id: elderId },
      include: {
        bookings: true,
      },
    });
  }

  async listEldersForFamilyMember(familyMemberId: number) {
    return this.dbClient.elderProfile.findMany({
      where: {
        familyelderlink: {
          some: {
            family_member_id: familyMemberId,
          },
        },
      },
    });
  }

  /* ---------------- UPDATE (HEALTH DATA) ---------------- */

  async updateElderProfile(
    elderId: number,
    data: {
      address?: string;
      phone?: string;
      medical_notes?: string;
      mobility_level?: MobilityLevel;
      notes?: string;
    }
  ) {
    return this.dbClient.elderProfile.update({
      where: { id: elderId },
      data,
    });
  }

  /* ---------------- BOOKING SUPPORT ---------------- */

  async validateElderForBooking(elderId: number) {
    const elder = await this.dbClient.elderProfile.findUnique({
      where: { id: elderId },
    });

    if (!elder) {
      throw new Error("Elder not found");
    }

    return elder;
  }
}
