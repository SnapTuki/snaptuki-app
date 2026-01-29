import { PrismaClient } from "@prisma/client";
import { CaregiverFilterInput } from "./cg.inputs";

export class CaregiverProfileService {
  private dbClient: PrismaClient;

  constructor(db: PrismaClient) {
    this.dbClient = db;
  }

  /* ---------------- READ OPERATIONS ---------------- */

  async getCaregiverById(profileId: number) {
    const profile = await this.dbClient.caregiverProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        education: {
          orderBy: { graduationYear: 'desc' }
        },
        experience: {
          orderBy: { startYear: 'desc' }
        },
        skills: true,
        offeredServices: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            reviewer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
      },
    });

    if (!profile) {
      throw new Error(`Caregiver profile with ID ${profileId} not found.`);
    }

    // Flatten user details for the return type
    return {
        ...profile,
        firstName: profile.user?.firstName || "Unknown",
        lastName: profile.user?.lastName || "Caregiver",
    };
  }

  async listCaregivers(filters?: CaregiverFilterInput) {
    const whereClause: any = {
      AND: [] // Initialize AND array for multiple conditions
    };

    if (filters?.city) {
      whereClause.AND.push({
        city: { contains: filters.city, mode: 'insensitive' }
      });
    }

    if (filters?.verified) {
      whereClause.AND.push({
        verified: true
      });
    }

    // Filter by Service IDs (Match ALL selected services)
    // If a user selects 3 services, the caregiver must have ALL 3.
    if (filters?.offeredServiceIds && filters.offeredServiceIds.length > 0) {
      filters.offeredServiceIds.forEach((serviceId) => {
        whereClause.AND.push({
          offeredServices: {
            some: {
              serviceId: serviceId
            }
          }
        });
      });
    }

    // If AND is empty, remove it to keep query clean (optional but good practice)
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    const caregivers = await this.dbClient.caregiverProfile.findMany({
      where: whereClause,
      select: {
        id: true,
        userId: true,
        city: true,
        profilePhotoUrl: true,
        hourlyRate: true,
        rating: true,
        completedJobsCount: true,
        availabilityStatus: true,
        bio: true,
        languages: true,
        verified: true,
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        // We might need to return the services to the frontend eventually, 
        // but for now the card type doesn't support it, so we rely on the filter working correctly.
      },
      orderBy: {
        rating: 'desc',
      },
      take: 50 
    });

    // MAPPING: Ensure firstName/lastName are never null by flattening the relation
    return caregivers.map((cg: any) => ({
      ...cg,
      firstName: cg.user?.firstName || "Unknown", 
      lastName: cg.user?.lastName || "Caregiver", 
    }));
  }
}