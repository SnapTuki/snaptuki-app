import { Field, ID, InputType } from "type-graphql";

/* -------------------------------
 * Service Category Inputs
 * ------------------------------- */

@InputType()
export class CreateServiceCategoryInput {
  @Field(() => String)
  categoryName!: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateServiceCategoryInput {
  @Field(() => String, { nullable: true })
  categoryName?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  isActive?: boolean;
}

/* -------------------------------
 * Service Task Inputs
 * ------------------------------- */

@InputType()
export class CreateServiceTaskInput {
  @Field(() => ID)
  categoryId!: number;

  @Field(() => String)
  serviceName!: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateServiceTaskInput {
  @Field(() => String, { nullable: true })
  serviceName?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
