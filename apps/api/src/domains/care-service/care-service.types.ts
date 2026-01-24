import { Field, ID, ObjectType } from "type-graphql";

/* -------------------------------
 * Service Task
 * ------------------------------- */
@ObjectType()
export class ServiceTask {
  @Field(() => ID)
  serviceId!: number;

  @Field(() => String)
  serviceName!: string;

  @Field(() => String)
  description?: string;

  @Field(() => Boolean)
  isActive!: boolean;
}

/* -------------------------------
 * Service Category
 * ------------------------------- */
@ObjectType()
export class ServiceCategory {
  @Field(() => ID)
  categoryId!: number;

  @Field(() => String)
  categoryName!: string;

  @Field(() => String)
  description?: string;


  @Field(() => [ServiceTask])
  serviceTasks!: ServiceTask[];
}
