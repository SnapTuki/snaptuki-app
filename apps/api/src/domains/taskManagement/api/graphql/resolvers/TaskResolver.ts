// src/domains/taskManagement/api/graphql/resolvers/TaskResolver.ts

import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { TaskType } from "../types/TaskTypes";
import {
  CreateTaskInput,
  CompleteTaskInputGql,
  ToggleChecklistItemInputGql,
  UpdateTaskInput
} from "../inputs/TaskInputs";

import { TaskMap } from "../../../../taskManagement/infrastructure/mappers/TaskMap";
import { GraphQLContext } from "../../../../../lib/graphqlContext";

import { CreateNewTaskUseCase } from "../../../application/useCases/CreateNewTaskUseCase";
import { CompleteTaskUseCase } from "../../../../taskManagement/application/useCases/CompleteTaskUseCase";
import { ToggleChecklistItemUseCase } from "../../../../taskManagement/application/useCases/ToggleChecklistItemUseCase";
import { UpdateTaskUseCase } from "../../../application/useCases/UpdateTaskUseCase";
import { FindAllTasksUseCase } from "../../../application/useCases/FindAllTasksUseCase";
import { CancelTaskUseCase } from "../../../application/useCases/CancleUseCase";

@Resolver(() => TaskType)
export class TaskResolver {

  @Query(() => [TaskType])
  async taskList(
    @Ctx() ctx: GraphQLContext,
    @Arg("search", () => String, { nullable: true }) search?: string,
    @Arg("status", () => String, { nullable: true }) status?: string,
    @Arg("caregiverId", () => String, { nullable: true }) caregiverId?: string,
    @Arg("residentId", () => String, { nullable: true }) residentId?: string,
    @Arg("skip", () => Number, { nullable: true }) skip?: number,
    @Arg("take", () => Number, { nullable: true }) take?: number,
    @Arg("startDate", () => Date, { nullable: true }) startDate?: Date,
    @Arg("endDate", () => Date, { nullable: true }) endDate?: Date,
    @Arg("dueAt", () => Date, { nullable: true }) dueAt?: Date,
  ) {
    const useCase = new FindAllTasksUseCase(ctx.taskManagement.repo);

    const result = await useCase.execute({
      search,
      status,
      caregiverId,
      residentId,
      startDate,
      endDate,
      skip,
      take,
      dueAt,
    });

    // Return the pre-mapped array directly
    return result; 
  }

  @Query(() => TaskType, { nullable: true })
  async taskById(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
    // This is the ONLY place we use TaskMap directly, because it bypasses the Use Cases
    const task = await ctx.taskManagement.repo.getById(id);
    return task ? TaskMap.toDTO(task) : null;
  }

  @Mutation(() => TaskType)
  async createTask(
    @Arg("input", () => CreateTaskInput) input: CreateTaskInput, 
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new CreateNewTaskUseCase(ctx.taskManagement.repo);

    // Use Case returns { task: TaskDTO }
    const result = await useCase.execute({
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority,
      residentId: input.residentId,
      assignedCaregiverId: input.assignedCaregiverId,
      dueAt: input.dueAt,
      checklist: input.checklist ?? undefined,
      createdByUserId: ctx.currentUser?.userId ?? "system",
    });

    return result.task;
  }

  @Mutation(() => TaskType)
  async completeTask(
    @Arg("input", () => CompleteTaskInputGql) input: CompleteTaskInputGql, 
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new CompleteTaskUseCase(ctx.taskManagement.repo);
    
    const result = await useCase.execute({
      id: input.id,
      completedByCaregiverId: input.completedByCaregiverId,
      notes: input.notes ?? null,
    });
    
    return result.task;
  }

  @Mutation(() => TaskType)
  async toggleChecklistItem(
    @Arg("input", () => ToggleChecklistItemInputGql) input: ToggleChecklistItemInputGql, 
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new ToggleChecklistItemUseCase(ctx.taskManagement.repo);
    
    const result = await useCase.execute({
      taskId: input.taskId,
      itemId: input.itemId,
      done: input.done,
      byCaregiverId: input.byCaregiverId ?? ctx.currentUser?.userId ?? null,
    });
    
    return result.task;
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Arg("input", () => UpdateTaskInput) input: UpdateTaskInput,
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new UpdateTaskUseCase(ctx.taskManagement.repo);
    
    const result = await useCase.execute({
      id: input.id,
      title: input.title,
      description: input.description,
      priority: input.priority,
      assignedCaregiverId: input.assignedCaregiverId,
      dueAt: input.dueAt,
      // explicitly removed the checklist payload to respect Domain bounds
    });

    return result.task;
  }

  @Mutation(() => TaskType)
  async cancelTask(
    @Arg("id", () => String) id: string,
    @Arg("reason", () => String, { nullable: true }) reason: string,
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new CancelTaskUseCase(ctx.taskManagement.repo);
    
    const result = await useCase.execute({ 
      id, 
      reason: reason ?? "Cancelled via system interface" 
    });
    
    return result;
  }
}