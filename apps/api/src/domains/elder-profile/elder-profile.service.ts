import { PrismaClient } from "@prisma/client";
import {
  CreateElderProfileInput,
  UpdateElderProfileInput,
} from "./elder-profile.inputs";

export class ElderProfileService {
  private dbClient: PrismaClient;

  constructor(db: PrismaClient) {
    this.dbClient = db;
  }

  /* ---------------- CREATE ---------------- */

  async createElderProfile(input: CreateElderProfileInput) {
    return this.dbClient.elderProfile.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
        address: input.address,
        phone: input.phone,
        medicalNotes: input.medicalNotes,
        mobilityLevel: input.mobilityLevel,
        familyMembers: {
          create: {
            relationship: input.relationship ?? "family",
            family: {
              connect: {
                id: input.familyMemberId
              }
            }
          }
        }
      },
    });
  }

  /* ---------------- READ ---------------- */

  async getElderById(elderId: number) {
    return this.dbClient.elderProfile.findUnique({
      where: { id: elderId },
    });
  }

  async listEldersForFamilyMember(familyMemberId: number) {
    console.log("Elderprofile service called");
    const result = await this.dbClient.elderProfile.findMany({
      where: {
        familyMembers: {
          some: {
            family: {
              userId: familyMemberId
            }
          },
        },
      },
    });

    return result
  }

  /* ---------------- UPDATE ---------------- */

  async updateElderProfile(
    elderId: number,
    input: UpdateElderProfileInput
  ) {
    return this.dbClient.elderProfile.update({
      where: { id: elderId },
      data: input,
    });
  }

  /* ---------------- DELETE ---------------- */

  async deleteElderProfile(elderId: number) {
    await this.dbClient.elderProfile.delete({
      where: { id: elderId },
    });
    return true;
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