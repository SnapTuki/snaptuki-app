import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { ElderProfile } from "./elder-profile.types";
import { UpdateElderProfileInput } from "./elder-profile.inputs";
import { GraphQLContext } from "../../context";

@Resolver()
export class ElderProfileResolver {

  /* ---------------- READ (INTERNAL / SHARED) ---------------- */

  @Query(() => ElderProfile, { nullable: true })
  async elderProfile(
    @Arg("elderId", () => ID) elderId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    // Used by booking, caregiver views, admin
    return ctx.services.elderProfileService.getElderById(elderId);
  }

  /* ---------------- UPDATE (HEALTH DATA ONLY) ---------------- */

}
