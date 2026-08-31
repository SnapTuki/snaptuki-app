// src/domains/taskManagement/api/graphql/resolvers/TaskResolver.ts

import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { CareTaskType } from "../types/CareTaskType";
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

@Resolver(() => CareTaskType)
export class CareTaskResolvers {

  @Query(() => CareTaskType, { nullable: true })
  async careTaskDetails(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
    //
  }


  @Query(() => [CareTaskListItemType])
  async todayCareTasks(@Ctx() ctx: GraphQLContext): Promise<CareTaskListItemType[]> {
    const useCase = new ViewTodayCareTasks(ctx.careTaskCoordination.repo);
    const result = await useCase.execute();
    return result.map((task) => ({
      id: task.id,
      title: task.title,
      priority: CareTaskPriorityGraphQLMapper.toGraphQL(task.priority),
      status: CareTaskStatusGraphQLMapper.toGraphQL(task.status),
      dueTime: task.dueTime,
    }));
  }


  @Mutation(() => CareTaskType)
  async createCareTask(
    @Arg("input", () => CreateCareTaskInput) input: CreateCareTaskInput,
    @Ctx() ctx: GraphQLContext
  ) {
    const useCase = new CreateCareTask(ctx.careTaskCoordination.repo);


    const result = await useCase.execute({
      title: input.title,
      description: input.description,
      priority: input.priority,
      assignedToResidentId: input.residentId,
      assignedToCaregiverId: input.caregiverId,
      dueTime: input.dueTime,
      status: input.status
    });

    return result
  }

  @Mutation()
  async updateCareTask(@Arg("input", () => UpdateCareTaskInput)
  input: UpdateCareTaskInput, @Ctx() ctx: GraphQLContext) {

    const updateUseCase = new UpdateCareTask(ctx.careTaskCoordination.repo)
    return await updateUseCase.execute({
      careTaskId: input.id,
      title: input.title,
      description: input.description
    })

  }

  @Mutation()
  async assignCareTask(
    @Arg("input", () => AssignCareTaskInput) input: AssignCareTaskInput,
    @Ctx() ctx: GraphQLContext) {
    const assignUseCase = new AssignCareTask(ctx.careTaskCoordination.repo);
    return assignUseCase.execute(input);
  }

  @Mutation()
  async changeCareTaskPriority(
    @Arg("input", () => ChangeCareTaskPriorityInput)
    input: ChangeCareTaskPriorityInput,

    @Ctx()
    ctx: GraphQLContext,
  ) {
    const useCase = new ChangeCareTaskPriority(ctx.careTaskCoordination.repo);
    return useCase.execute(input);
  }

  @Mutation()
  async rescheduleCareTask(
    @Arg("input", () => RescheduleCareTaskInput)
    input: RescheduleCareTaskInput,

    @Ctx()
    ctx: GraphQLContext
  ) {

    const useCase = new RescheduleCareTask(ctx.careTaskCoordination.repo);
    return useCase.execute(input);
  }

  @Mutation()
  async cancelCareTask(
    @Arg("input", () => CancelCareTaskInput)
    input: CancelCareTaskInput,

    @Ctx()
    ctx: GraphQLContext
  ) {
    const useCase = new CancelCareTask(ctx.careTaskCoordination.repo);
    return useCase.execute(input);
  }

  @Mutation()
  async completeCareTask(@Arg("input", () => CompleteCareTaskInput)
  input: CompleteCareTaskInput,

    @Ctx()
    ctx: GraphQLContext) {

      const useCase = new CompleteCareTask(ctx.careTaskCoordination.repo);
      return useCase.execute(input)
  }



}