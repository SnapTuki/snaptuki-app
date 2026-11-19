// src/domains/taskManagement/api/graphql/resolvers/TaskResolver.ts

import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { CareTaskDetailsType, CareTaskType } from "../types/CareTaskType";
import { CreateCareTaskInput } from "../inputs/CreateCareTaskInput";
import { GraphQLContext } from "../../../../../lib/graphqlContext";
import { CreateCareTask } from "../../../application/useCases/CreateCareTask";
import { ViewTodayCareTasks } from "../../../application/useCases/ViewTodayCareTasks";
import { CareTaskListItemType } from "../types/CareTaskType";
import { CareTaskPriorityGraphQLMapper, CareTaskStatusGraphQLMapper } from "../mappers";
import { UpdateCareTaskInput } from "../inputs/updateCareTaskInput";
import { UpdateCareTask } from "../../../application/useCases/UpdateCareTask";
import { AssignCareTask } from "../../../application/useCases/AssignCareTask";
import { AssignCareTaskInput, CancelCareTaskInput, ChangeCareTaskPriorityInput, CompleteCareTaskInput, RescheduleCareTaskInput } from "../inputs/graphqlInputTypes";
import { ChangeCareTaskPriority } from "../../../application/useCases/ChangeCareTaskPriority";
import { RescheduleCareTask } from "../../../application/useCases/RescheduelCareTask";
import { CancelCareTask } from "../../../application/useCases/CancelCareTask";
import { CompleteCareTask } from "../../../application/useCases/CompleteCareTask";
import {ViewCareTaskDetails} from "../../../application/useCases/ViewCareTaskDetails";
import { CareTaskPriorityGraphQL } from "../enums/CareTaskPriorityGraphQL";
import {ViewTomorrowCareTasks} from "../../../application/useCases/ViewTomorrowCareTasks";
@Resolver(() => CareTaskType)
export class CareTaskResolvers {

  @Query(() => CareTaskDetailsType, { nullable: true })
  async careTaskDetails(@Arg("careTaskId", () => String) careTaskId: string, @Ctx() ctx: GraphQLContext) {
    const useCase = new ViewCareTaskDetails(ctx.careTaskCoordination.repo);
    const result = await useCase.execute(careTaskId);

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      title: result.title,
      description: result.description,
      priority: CareTaskPriorityGraphQLMapper.toGraphQL(result.priority),
      status: CareTaskStatusGraphQLMapper.toGraphQL(result.status),
      dueTime: result.dueTime,
      completionNote: result.completionNote,
      assignedToCaregiver: result.assignedToCaregiver ? {
        id: result.assignedToCaregiver.id,
        firstName: result.assignedToCaregiver.firstName,
        lastName: result.assignedToCaregiver.lastName
      } : null,
      assignedToResident: result.assignedToResident ? {
        residentId: result.assignedToResident.residentId,
        firstName: result.assignedToResident.firstName,
        lastName: result.assignedToResident.lastName
      } : null
    };
  }


  @Query(() => [CareTaskListItemType])
  async todayCareTasks(@Ctx() ctx: GraphQLContext): Promise<CareTaskListItemType[]> {
    const useCase = new ViewTodayCareTasks(ctx.careTaskCoordination.repo);
    const result = await useCase.execute();
    console.log("Today tasks: ",result);
    return result.map((task) => ({
      id: task.id,
      title: task.title,
      priority: CareTaskPriorityGraphQLMapper.toGraphQL(task.priority),
      status: CareTaskStatusGraphQLMapper.toGraphQL(task.status),
      dueTime: task.dueTime,
      assignedToCaregiver: task.assignedToCaregiver ? {
        id: task.assignedToCaregiver.id,
        firstName: task.assignedToCaregiver.firstName,
        lastName: task.assignedToCaregiver.lastName
      } : null,
      assignedToResident: task.assignedToResident ? {
        residentId: task.assignedToResident.residentId,
        firstName: task.assignedToResident.firstName,
        lastName: task.assignedToResident.lastName
      } : null
    }));
  }


  @Query(() => [CareTaskListItemType])
  async tomorrowCareTasks(@Ctx() ctx: GraphQLContext): Promise<CareTaskListItemType[]>{

    const useCase = new ViewTomorrowCareTasks(ctx.careTaskCoordination.repo);
    const result = await useCase.execute();

    return result.map((task) => ({
        id: task.id,
        title: task.title,
        priority: CareTaskPriorityGraphQLMapper.toGraphQL(task.priority),
        status: CareTaskStatusGraphQLMapper.toGraphQL(task.status),
        dueTime: task.dueTime,
        assignedToCaregiver: task.assignedToCaregiver ? {
          id: task.assignedToCaregiver.id,
          firstName: task.assignedToCaregiver.firstName,
          lastName: task.assignedToCaregiver.lastName
        } : null,
        assignedToResident: task.assignedToResident ? {
          residentId: task.assignedToResident.residentId,
          firstName: task.assignedToResident.firstName,
          lastName: task.assignedToResident.lastName
        } : null
      }))
    

  }

  @Mutation(() => CareTaskType)
  async createCareTask(
    @Arg("input", () => CreateCareTaskInput) input: CreateCareTaskInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<CareTaskListItemType> {
    const useCase = new CreateCareTask(ctx.careTaskCoordination.repo);


    const result = await useCase.execute({
      title: input.title,
      description: input.description,
      priority: input.priority,
      assignedToResidentId: input.residentId,
      assignedToCaregiverId: input.caregiverId,
      dueTime: input.dueTime,
      status: input.status,
    });

    return {...result, 
      priority: CareTaskPriorityGraphQLMapper.toGraphQL(result.priority), 
      status: CareTaskStatusGraphQLMapper.toGraphQL(result.status)}
  }

  @Mutation(() => CareTaskType)
  async updateCareTask(@Arg("input", () => UpdateCareTaskInput)
  input: UpdateCareTaskInput, @Ctx() ctx: GraphQLContext) {

    const updateUseCase = new UpdateCareTask(ctx.careTaskCoordination.repo)
    return await updateUseCase.execute({
      careTaskId: input.id,
      title: input.title,
      description: input.description
    })

  }

  @Mutation(() => CareTaskType)
  async assignCareTask(
    @Arg("input", () => AssignCareTaskInput) input: AssignCareTaskInput,
    @Ctx() ctx: GraphQLContext) {
    const assignUseCase = new AssignCareTask(ctx.careTaskCoordination.repo);
    return assignUseCase.execute(input);
  }

  @Mutation(() => CareTaskType)
  async changeCareTaskPriority(
    @Arg("input", () => ChangeCareTaskPriorityInput)
    input: ChangeCareTaskPriorityInput,

    @Ctx()
    ctx: GraphQLContext,
  ) {
    const useCase = new ChangeCareTaskPriority(ctx.careTaskCoordination.repo);
    return useCase.execute(input);
  }

  @Mutation(() => CareTaskType)
  async rescheduleCareTask(
    @Arg("input", () => RescheduleCareTaskInput)
    input: RescheduleCareTaskInput,

    @Ctx()
    ctx: GraphQLContext
  ) {

    const useCase = new RescheduleCareTask(ctx.careTaskCoordination.repo);
    return useCase.execute(input);
  }

  @Mutation(() => CareTaskType)
  async cancelCareTask(
    @Arg("input", () => CancelCareTaskInput)
    input: CancelCareTaskInput,

    @Ctx()
    ctx: GraphQLContext
  ) {
    const useCase = new CancelCareTask(ctx.careTaskCoordination.repo);
    return useCase.execute(input);
  }

  @Mutation(() => CareTaskType)
  async completeCareTask(@Arg("input", () => CompleteCareTaskInput)
  input: CompleteCareTaskInput,

    @Ctx()
    ctx: GraphQLContext) {

      const useCase = new CompleteCareTask(ctx.careTaskCoordination.repo);
      return useCase.execute(input)
  }



}