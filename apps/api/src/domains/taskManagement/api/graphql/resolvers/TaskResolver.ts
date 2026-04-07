// src/domains/taskManagement/api/graphql/resolvers/TaskResolver.ts
import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { TaskType } from "../types/TaskTypes";
import {
  AssignTaskInputGql,
  CompleteTaskInputGql,
  ToggleChecklistItemInputGql
} from "../inputs/TaskInputs";

import { PrismaTaskRepo } from "../../../../taskManagement/infrastructure/repos/PrismaTaskRepo";
import { TaskMap } from "../../../../taskManagement/infrastructure/mappers/TaskMap";

import { AssignTaskUseCase } from "../../../../taskManagement/application/useCases/AssignTaskUseCase";
import { CompleteTaskUseCase } from "../../../../taskManagement/application/useCases/CompleteTaskUseCase";
import { ToggleChecklistItemUseCase } from "../../../../taskManagement/application/useCases/ToggleChecklistItemUseCase";
import { GraphQLContext } from "../../../../../lib/graphqlContext";

@Resolver(() => TaskType)
export class TaskResolver {

  @Query(() => [TaskType])
  async taskList(
    @Ctx() ctx: GraphQLContext,
    @Arg("search", () => String,{ nullable: true }) search?: string,
    @Arg("status", () => String, { nullable: true }) status?: string,
    @Arg("caregiverId", () => String, { nullable: true }) caregiverId?: string,
    @Arg("residentId", () => String,{ nullable: true }) residentId?: string,
    @Arg("skip", () => Number,{ nullable: true }) skip?: number,
    @Arg("take", () => Number,{ nullable: true }) take?: number,
    
  ) {
    const tasks = await ctx.taskManagement.repo.list({
      search: search ?? null,
      status: status ?? null,
      caregiverId: caregiverId ?? null,
      residentId: residentId ?? null,
      skip, take
    });
    console.log(tasks.map(TaskMap.toDTO));
    return tasks.map(TaskMap.toDTO) as any;
  }

  @Query(() => TaskType, { nullable: true })
  async taskById(@Arg("id", () => String) id: string, @Ctx('ctx') ctx: GraphQLContext) {
    const task = await ctx.taskManagement.repo.getById(id);
    return task ? (TaskMap.toDTO(task) as any) : null;
  }

  // Assigning tasks
  @Mutation(() => TaskType)
  async assignTask(@Arg("input", () => AssignTaskInputGql) input: AssignTaskInputGql, @Ctx() ctx: GraphQLContext) {
    const useCase = new AssignTaskUseCase(ctx.taskManagement.repo);
    const task = await useCase.execute({
      id: input.id,
      title: input.title,
      description: input.description ?? null,
      category: input.category,
      priority: input.priority,
      residentId: input.residentId ?? null,
      assignedCaregiverId: input.assignedCaregiverId,
      dueAt: input.dueAt ? input.dueAt.toISOString() : null,
      checklist: input.checklist ?? undefined,
      createdByUserId: ctx.currentUser?.userId ?? "system",
    });
    return TaskMap.toDTO(task) as any;
  }

  // Tracking completion

  @Mutation(() => TaskType)
  async completeTask(@Arg("input", () => CompleteTaskInputGql) input: CompleteTaskInputGql, @Ctx() ctx: GraphQLContext) {
    const useCase = new CompleteTaskUseCase(ctx.taskManagement.repo);
    const task = await useCase.execute({
      id: input.id,
      completedByCaregiverId: input.completedByCaregiverId,
      notes: input.notes ?? null,
    });
    return TaskMap.toDTO(task) as any;
  }

  // Optional checklist progress
  @Mutation(() => TaskType)
  async toggleChecklistItem(@Arg("input", () => ToggleChecklistItemInputGql) input: ToggleChecklistItemInputGql, @Ctx() ctx: GraphQLContext) {
    const useCase = new ToggleChecklistItemUseCase(ctx.taskManagement.repo);
    const task = await useCase.execute({
      taskId: input.taskId,
      itemId: input.itemId,
      done: input.done,
      byCaregiverId: input.byCaregiverId ?? ctx.currentUser?.userId ?? null,
    });
    return TaskMap.toDTO(task) as any;
  }
}