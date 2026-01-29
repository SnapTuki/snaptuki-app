import { PrismaClient } from "@prisma/client";
import { 
  CreateFamilyProfileInput, 
  UpdateFamilyMemberProfileInput 
} from "./family-profile.inputs";

export class FamilyProfileService {
  private dbClient: PrismaClient;

  constructor(db: PrismaClient) {
    this.dbClient = db;
  }

  /* ---------------- PROFILE ---------------- */

  async createFamilyProfile(
    userId: number,
    familyProfileData: CreateFamilyProfileInput
  ) {
    return this.dbClient.familymemberProfile.create({
      data: {
        ...familyProfileData,
        user_id: userId,
      },
    });
  }

  async getMyFamilyProfile(userId: number) {
    return this.dbClient.familymemberProfile.findUnique({
      where: { userId: userId },
      include: {
        managed_elders: {
          include: {
            elderprofile: true,
          },
        },
      },
    });
  }

  // --- Added Update Method ---
  async updateFamilyProfile(
    userId: number,
    data: UpdateFamilyMemberProfileInput
  ) {
    return this.dbClient.familymemberProfile.update({
      where: { userId: userId },
      data: {
        ...data
      },
    });
  }

  /* ---------------- ELDERS ---------------- */

  async createElderAndLink(
    familyProfileId: number,
    elderProfileData: any
  ) {
    return this.dbClient.$transaction(async (tx: any) => {
      const elder = await tx.elderProfile.create({
        data: elderProfileData,
      });

      await tx.familyWithElder.create({
        data: {
          family_member_id: familyProfileId,
          elder_id: elder.id,
        },
      });

      return elder;
    });
  }

  async linkExistingElder(
    familyProfileId: number,
    elderProfileId: number
  ) {
    return this.dbClient.familyWithElder.create({
      data: {
        family_member_id: familyProfileId,
        elder_id: elderProfileId,
      },
    });
  }

  async unlinkElder(
    familyProfileId: number,
    elderProfileId: number
  ) {
    return this.dbClient.familyWithElder.deleteMany({
      where: {
        family_member_id: familyProfileId,
        elder_id: elderProfileId,
      },
    });
  }

  async getManagedElders(familyProfileId: number) {
    return this.dbClient.familyWithElder.findMany({
      where: {
        family_member_id: familyProfileId,
      },
      include: {
        elderprofile: true,
      },
    });
  }

  async setPrimaryContact(
    familyProfileId: number,
    elderId: number
  ) {
    // Optional extension: requires is_primary_contact column
    // For now, ensure single relationship exists
    return this.dbClient.familyWithElder.updateMany({
      where: {
        family_member_id: familyProfileId,
        elder_id: elderId,
      },
      data: {},
    });
  }
}