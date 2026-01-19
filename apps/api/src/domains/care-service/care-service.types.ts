import { Field, ID, ObjectType } from "type-graphql";

/* -------------------------------
 * Service Task
 * ------------------------------- */
@ObjectType()
export class ServiceTask {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  service_name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean)
  is_active!: boolean;

  @Field(() => Date)
  created_at!: Date;

  @Field(() => Date)
  updated_at!: Date;
}

/* -------------------------------
 * Service Category
 * ------------------------------- */
@ObjectType()
export class ServiceCategory {
  @Field(() => ID)
  category_id!: number;

  @Field(() => String)
  category_name!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean)
  is_active!: boolean;

  @Field(() => Date)
  created_at!: Date;

  @Field(() => [ServiceTask])
  servicetasks!: ServiceTask[];
}
