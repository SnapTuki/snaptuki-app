import {
  Arg,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { ServiceCategory, ServiceTask } from "./care-service.types";
import {
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
  CreateServiceTaskInput,
  UpdateServiceTaskInput,
} from "./care-service.inputs";
import { GraphQLContext } from "../../context"; // adjust path if needed

@Resolver()
export class CareServiceResolver {
 
  /* -------------------------------
   * QUERIES
   * ------------------------------- */

  @Query(() => [ServiceCategory])
  async getAllServiceCategories(
    @Ctx() ctx: GraphQLContext
  ): Promise<ServiceCategory[]> {
    const src = await ctx.services.careServiceService.getAllServiceCategories();
    console.log(src)
    return src;
  }

  @Query(() => ServiceCategory, { nullable: true })
  async getServiceCategory(
    @Arg("categoryId", () => ID) categoryId: number,
    @Ctx() ctx: GraphQLContext
  ): Promise<ServiceCategory | null> {
    return ctx.services.careServiceService.getServiceCategoryById(categoryId);
  }

  @Query(() => [ServiceTask])
  async getServiceTasksByCategory(
    @Arg("categoryId", () => ID) categoryId: number,
    @Ctx() ctx: GraphQLContext
  ): Promise<ServiceTask[]> {
    return ctx.services.careServiceService.getServiceTasksByCategory(categoryId);
  }

  /* -------------------------------
   * MUTATIONS (ADMIN)
   * ------------------------------- */

  @Mutation(() => ServiceCategory)
  // @Authorized("ADMIN")
  async createServiceCategory(
    @Arg("data", () => CreateServiceCategoryInput) data: CreateServiceCategoryInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<ServiceCategory> {
    return ctx.services.careServiceService.createServiceCategory(data);
  }

  @Mutation(() => ServiceCategory)
  // @Authorized("ADMIN")
  async updateServiceCategory(
    @Arg("categoryId", () => ID) categoryId: number,
    @Arg("data", () => UpdateServiceCategoryInput) data: UpdateServiceCategoryInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<ServiceCategory> {
    return ctx.services.careServiceService.updateServiceCategory(categoryId, data);
  }

  @Mutation(() => Boolean)
  // @Authorized("ADMIN")
  async deleteServiceCategory(
    @Arg("categoryId", () => ID) categoryId: number,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    await ctx.services.careServiceService.deleteServiceCategory(categoryId);
    return true;
  }

  @Mutation(() => ServiceTask)
  // @Authorized("ADMIN")
  async createServiceTask(
    @Arg("data", () => CreateServiceTaskInput) data: CreateServiceTaskInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<ServiceTask> {
    return ctx.services.careServiceService.createServiceTask(data);
  }

  @Mutation(() => ServiceTask)
  // @Authorized("ADMIN")
  async updateServiceTask(
    @Arg("taskId", () => ID) taskId: number,
    @Arg("data", () => UpdateServiceTaskInput) data: UpdateServiceTaskInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<ServiceTask> {
    return ctx.services.careServiceService.updateServiceTask(taskId, data);
  }

  @Mutation(() => Boolean)
  // @Authorized("ADMIN")
  async deleteServiceTask(
    @Arg("taskId", () => ID) taskId: number,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    await ctx.services.careServiceService.deleteServiceTask(taskId);
    return true;
  }
}
