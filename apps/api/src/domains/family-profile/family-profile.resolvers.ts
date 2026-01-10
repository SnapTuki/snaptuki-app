import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { FamilyProfile } from "./family-profile.types";
import { ElderProfile } from "../elder-profile/elder-profile.types";
import {
  CreateFamilyProfileInput,
  ElderProfileData,
} from "./family-profile.inputs";
import { GraphQLContext } from "../../context";

@Resolver()
export class FamilyProfileResolver {

  /* ---------------- QUERIES ---------------- */

  @Query(() => FamilyProfile)
  async myFamilyProfile(@Ctx() ctx: GraphQLContext) {
    return ctx.services.familyProfileService.getMyFamilyProfile(ctx.user.id);
  }

  @Query(() => [ElderProfile])
  async myManagedElders(@Ctx() ctx: GraphQLContext) {
    const profile = await ctx.services.familyProfileService.getMyFamilyProfile(
      ctx.user.id
    );

    return ctx.services.familyProfileService.getManagedElders(profile.id);
  }

  /* ---------------- MUTATIONS ---------------- */

  @Mutation(() => FamilyProfile)
  async createFamilyProfile(
    @Arg("data", () => CreateFamilyProfileInput) data: CreateFamilyProfileInput,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.familyProfileService.createFamilyProfile(
      ctx.user.id,
      data
    );
  }

  @Mutation(() => ElderProfile)
  async createElderAndLink(
    @Arg("data", ()=>ElderProfileData) data: ElderProfileData,
    @Ctx() ctx: GraphQLContext
  ) {
    const profile = await ctx.services.familyProfileService.getMyFamilyProfile(
      ctx.user.id
    );

    return ctx.services.familyProfileService.createElderAndLink(profile.id, data);
  }

  @Mutation(() => Boolean)
  async linkExistingElder(
    @Arg("elderId", () => ID) elderId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    const profile = await ctx.services.familyProfileService.getMyFamilyProfile(
      ctx.user.id
    );

    await ctx.services.familyProfileService.linkExistingElder(profile.id, elderId);
    return true;
  }

  @Mutation(() => Boolean)
  async unlinkElder(
    @Arg("elderId", () => ID) elderId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    const profile = await ctx.services.familyProfileService.getMyFamilyProfile(
      ctx.user.id
    );

    await ctx.services.familyProfileService.unlinkElder(profile.id, elderId);
    return true;
  }
}
