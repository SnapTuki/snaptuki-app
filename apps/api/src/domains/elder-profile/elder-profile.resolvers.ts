import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  Int,
} from "type-graphql";
import { ElderProfile, ElderProfileCard } from "./elder-profile.types";
import {
  CreateElderProfileInput,
  UpdateElderProfileInput,
} from "./elder-profile.inputs";

import {GraphQLContext} from '../../context'


@Resolver()
export class ElderProfileResolver {

  /* =========================
      READ OPERATIONS
     ========================= */

  /**
   * Get elder profile by ID
   * Used for:
   * - booking flow
   * - elder details
   * - care history
   */
  @Query(() => ElderProfile, { nullable: true })
  async getElderProfile(
    @Arg("elderId", () => Int) elderId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.elderProfileService.getElderById(elderId);
  }

  /**
   * List elders for logged-in family member
   */
  @Query(() => [ElderProfileCard])
  async listMyElders(
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.elderProfileService.listEldersForFamilyMember(ctx.user.id);
  }

  /* =========================
      WRITE OPERATIONS
     ========================= */

  /**
   * Create elder profile
   * (used internally by FamilyProfile module OR exposed if needed)
   */
  @Mutation(() => ElderProfile)
  async createElderProfile(
    @Arg("input", () => CreateElderProfileInput) input: CreateElderProfileInput,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.elderProfileService.createElderProfile({
      ...input
    });
  }

  /**
   * Update elder profile data
   */
  @Mutation(() => ElderProfile)
  async updateElderProfile(
    @Arg("elderId", () => Int) elderId: number,
    @Arg("input", () => UpdateElderProfileInput) input: UpdateElderProfileInput,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.elderProfileService.updateElderProfile(
      elderId,
      input
    );
  }

  /**
   * Remove an elder profile
   * Returns true if successful
   */
  @Mutation(() => Boolean)
  async removeElderProfile(
    @Arg("elderId", () => Int) elderId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.elderProfileService.deleteElderProfile(elderId);
  }
}