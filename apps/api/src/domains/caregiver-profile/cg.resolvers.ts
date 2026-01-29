import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { CaregiverProfile, CaregiverProfileCard } from "./cg.types";
import { GraphQLContext } from "../../context";

@Resolver()
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
}