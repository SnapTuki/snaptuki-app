import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { CareTaskBook, CareTask } from "./ctb-types";
import { UpdateCareTaskStatusInput } from "./ctb.inputs";
import { CareTaskStatus } from "../../generated/prisma";
import { GraphQLContext } from "../../context";

/* =====================================
   CONTEXT TYPE EXPECTATION
===================================== */
/*
ctx.services.careTaskBookService
ctx.user { id, role }
*/

@Resolver()
export class CareTaskBookResolver {
  /* ============================
     QUERIES
  ============================ */

  @Query(() => CareTaskBook, { nullable: true })
  async getCareTaskBookByBooking(
    @Arg("bookingId", () => Int) bookingId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.careTaskBookService.getTaskBookByBooking(bookingId);
  }

  @Query(() => CareTaskBook, { nullable: true })
  async getCareTaskBook(
    @Arg("taskBookId", () => Int) taskBookId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    return ctx.services.careTaskBookService.getTaskBook(taskBookId);
  }

  /* ============================
     MUTATIONS (CAREGIVER)
  ============================ */

  @Mutation(() => CareTask)
  async updateCareTaskStatus(
    @Arg("data", () => UpdateCareTaskStatusInput) data: UpdateCareTaskStatusInput,
    @Ctx() ctx: GraphQLContext
  ) {
    const user = ctx.user;

    if (!user || user.role !== "CAREGIVER") {
      throw new Error("Only caregivers can update care tasks");
    }

    return ctx.services.careTaskBookService.updateTaskStatus(
      data.taskId,
      user.id, 
      data.status as CareTaskStatus,
      data.caregiverNotes
    );
  }

  /* ============================
     MUTATIONS (SYSTEM / ADMIN)
  ============================ */

  @Mutation(() => CareTaskBook)
  async completeCareTaskBook(
    @Arg("taskBookId", () => Int) taskBookId: number,
    @Ctx() ctx: GraphQLContext
  ) {
    const user = ctx.user;

    if (!user || (user.role !== "ADMIN" && user.role !== "CAREGIVER")) {
      throw new Error("Not authorized to complete task book");
    }

    return ctx.services.careTaskBookService.completeTaskBook(taskBookId);
  }
}
