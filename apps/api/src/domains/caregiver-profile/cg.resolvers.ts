import { Arg, Ctx, Int, Query, Resolver, FieldResolver, Root } from "type-graphql";
import { CaregiverProfile, CaregiverProfileCard } from "./cg.types";
import { GraphQLContext } from "../../context";

@Resolver(() => CaregiverProfileCard)
export class CaregiverProfileResolver {
  
  /* ---------------- READ OPERATIONS ---------------- */

  /**
   * Fetch a single caregiver's full profile by their profile ID.
   * Used for the detailed profile view screen.
   */
  @Query(() => CaregiverProfile, { nullable: true })
  async getCaregiver(
    @Arg("profileId", () => Int) profileId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    // You might want to add error handling here if the service throws
    const result = await ctx.services.caregiverProfileService.getCaregiverById(profileId);
    console.log(result);
    return result;
  }

  /**
   * List caregivers for the directory / search results.
   * Returns a lightweight 'Card' version of the profile.
   * * Optional filters can be added as arguments (e.g. city, verifiedOnly).
   */
  @Query(() => [CaregiverProfileCard])
  async listCaregivers(
    @Arg("city", () => String, { nullable: true }) city: string,
    @Arg("verified", () => Boolean, { nullable: true }) verified: boolean,
    // Change [Number] to [Int] because GraphQL uses Int/Float, not Number.
    // [Int] maps to number[] in TypeScript.
    @Arg("offeredServiceIds", () => [Int], { nullable: true }) offeredServiceIds: number[],
    @Ctx() ctx: GraphQLContext
  ) {
    return await ctx.services.caregiverProfileService.listCaregivers({
      city,
      verified,
      offeredServiceIds,
    });
  }


  @FieldResolver(() => String)
  async firstName(@Root() profile: any) {
    // Priority 1: Check if Service already flattened it (current behavior)
    if (profile.firstName) return profile.firstName;

    // Priority 2: Check nested Prisma User relation (future-proof)
    if (profile.user?.firstName) return profile.user.firstName;

    return "Unknown";
  }

  @FieldResolver(() => String)
  async lastName(@Root() profile: any) {
    if (profile.lastName) return profile.lastName;
    if (profile.user?.lastName) return profile.user.lastName;
    return "Caregiver";
  }
}