// src/domains/taskManagement/api/graphql/resolvers/TaskResolver.ts
import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { TaskType } from "../types/TaskTypes";
import {
  CreateTaskInput,
  CompleteTaskInputGql,
  ToggleChecklistItemInputGql
} from "../inputs/TaskInputs";

import { PrismaTaskRepo } from "../../../../taskManagement/infrastructure/repos/PrismaTaskRepo";
import { TaskMap } from "../../../../taskManagement/infrastructure/mappers/TaskMap";

import { CreateNewTaskUseCase } from "../../../application/useCases/CreateNewTaskUseCase";
import { CompleteTaskUseCase } from "../../../../taskManagement/application/useCases/CompleteTaskUseCase";
import { ToggleChecklistItemUseCase } from "../../../../taskManagement/application/useCases/ToggleChecklistItemUseCase";
import { GraphQLContext } from "../../../../../lib/graphqlContext";
import { UpdateTaskInput } from "../inputs/TaskInputs";
import { UpdateTaskUseCase } from "../../../application/useCases/UpdateTaskUseCase";
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
    return tasks.map(TaskMap.toDTO) as any;
  }

  @Query(() => TaskType, { nullable: true })
  async taskById(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
    const task = await ctx.taskManagement.repo.getById(id);
    return task ? (TaskMap.toDTO(task) as any) : null;
  }

  // Assigning tasks
  @Mutation(() => TaskType)
  async createTask(@Arg("input", () => CreateTaskInput) input: CreateTaskInput, @Ctx() ctx: GraphQLContext) {
    console.log("INput from form: ", input)
    const useCase = new CreateNewTaskUseCase(ctx.taskManagement.repo);

    const task = await useCase.execute({
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority,
      residentId: input.residentId ?? null,
      assignedCaregiverId: input.assignedCaregiverId,
      dueAt: input.dueAt ? input.dueAt : null,
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

  @Mutation(() => TaskType)
  async updateTask(
    @Arg("input", () => UpdateTaskInput) input: UpdateTaskInput, 
    @Ctx() ctx: GraphQLContext
  ) {
    // 1. Initialize the Use Case
    const useCase = new UpdateTaskUseCase(ctx.taskManagement.repo);
    console.log("Before executing use case: ")
    // 2. Execute with the provided input
    const task = await useCase.execute({
      id: input.id,
      title: input.title,
      description: input.description,
      priority: input.priority,
      assignedCaregiverId: input.assignedCaregiverId,
      dueAt: input.dueAt,
      checklist: input.checklist,
    });
    console.log("Task returned: ", task)

    // 3. Map back to the DTO for the frontend
    // This TaskMap.toDTO is what ensures assignedCaregiver is an object, not a string!
    
    return TaskMap.toDTO(task) as any;
  }
}