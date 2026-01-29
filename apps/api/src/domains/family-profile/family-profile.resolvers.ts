import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";
import { FamilyProfile } from "./family-profile.types";
import { ElderProfile } from "../elder-profile/elder-profile.types";
import {
  CreateFamilyProfileInput,
  ElderProfileData,
  UpdateFamilyMemberProfileInput,
} from "./family-profile.inputs";
import { GraphQLContext } from "../../context";
import { User } from "../auth/auth.types";
@Resolver(() => FamilyProfile)
export class FamilyProfileResolver {

  /* ---------------- QUERIES ---------------- */

  @Query(() => FamilyProfile, { nullable: true })
  async myFamilyProfile(@Ctx() ctx: GraphQLContext) {
    if (!ctx.user) return null;
    return ctx.services.familyProfileService.getMyFamilyProfile(ctx.user.id);
  }

  @Query(() => [ElderProfile])
  async myManagedElders(@Ctx() ctx: GraphQLContext) {
    if (!ctx.user) return [];
    const profile = await ctx.services.familyProfileService.getMyFamilyProfile(
      ctx.user.id
    );
    
    if (!profile) return [];

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

  @Mutation(() => FamilyProfile)
  async updateFamilyMemberProfile(
    @Arg("input", () => UpdateFamilyMemberProfileInput) input: UpdateFamilyMemberProfileInput,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.familyProfileService.updateFamilyProfile(
      ctx.user.id,
      input
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

// ---------------------------------------------------------
// EXTEND USER RESOLVER
// This allows { me { familyMemberProfile { ... } } } to work
// ---------------------------------------------------------

@Resolver(() => User)
export class UserFamilyProfileResolver {
  
  @FieldResolver(() => FamilyProfile, { nullable: true })
  async familyMemberProfile(
    @Root() user: User,
    @Ctx() ctx: GraphQLContext
  ) {
    // Optimization: If prisma already fetched it (e.g. via .include), return it
    if ((user as any).familyMemberProfile) {
      return (user as any).familyMemberProfile;
    }

    // Otherwise, fetch it specifically for this user
    return ctx.services.familyProfileService.getMyFamilyProfile(user.id);
  }
}