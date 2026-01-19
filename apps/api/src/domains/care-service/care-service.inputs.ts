import { Field, ID, InputType } from "type-graphql";

/* -------------------------------
 * Service Category Inputs
 * ------------------------------- */

@InputType()
export class CreateServiceCategoryInput {
  @Field(() => String)
  category_name!: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateServiceCategoryInput {
  @Field(() => String, { nullable: true })
  category_name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  is_active?: boolean;
}

/* -------------------------------
 * Service Task Inputs
 * ------------------------------- */

@InputType()
export class CreateServiceTaskInput {
  @Field(() => ID)
  category_id!: number;

  @Field(() => String)
  service_name!: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateServiceTaskInput {
  @Field(() => String, { nullable: true })
  service_name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  is_active?: boolean;
}
