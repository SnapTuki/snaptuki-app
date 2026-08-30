// src/domains/taskManagement/api/graphql/resolvers/TaskResolver.ts

import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { CareTaskType } from "../types/CareTaskType";
import { CreateCareTaskInput } from "../inputs/CreateCareTaskInput";
import { GraphQLContext } from "../../../../../lib/graphqlContext";
import {CreateCareTask} from "../../../application/useCases/CreateCareTask";
import {ViewTodayCareTasks} from "../../../application/useCases/ViewTodayCareTasks";
import {CareTaskListItemType} from "../types/CareTaskType";
import {CareTaskPriorityGraphQLMapper, CareTaskStatusGraphQLMapper} from "../mappers";

@Resolver(() => CareTaskType)
export class CareTaskResolvers {

  @Query(() => CareTaskType, { nullable: true })
  async taskById(@Arg("id", () => String) id: string, @Ctx() ctx: GraphQLContext) {
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



}