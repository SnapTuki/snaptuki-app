// src/domains/taskManagement/api/graphql/inputs/TaskInputs.ts
import { InputType, Field, ID } from "type-graphql";
import { TaskCategory, TaskPriority, TaskStatus } from "../../../../../generated/prisma";
import { GraphQLDateTime } from "graphql-scalars";
@InputType()
export class ChecklistItemInput {
    @Field(() => ID) id!: string;
    @Field(() => String) label!: string;
    @Field(() => Boolean, { nullable: true }) required?: boolean;
    @Field(() => Boolean, {nullable: true}) done?: boolean;
}

@InputType()
export class CreateTaskInput {
    @Field(() => String) title!: string;
    @Field(() => String) description?: string;
    @Field(() => TaskStatus) status?: TaskStatus;
    @Field(() => TaskCategory) category!: TaskCategory;
    @Field(() => TaskPriority) priority!: TaskPriority;
    @Field(() => String, { nullable: true }) residentId?: string | null;
    @Field(() => String) assignedCaregiverId!: string;
    @Field(() => GraphQLDateTime, { nullable: true }) dueAt?: Date | null;
    @Field(() => [ChecklistItemInput], { nullable: true }) checklist?: ChecklistItemInput[] | null;
}

@InputType()
export class CompleteTaskInputGql {
    @Field(() => ID) id!: string;
    @Field(() => ID) completedByCaregiverId!: string;
    @Field(() => String, { nullable: true }) notes?: string[] | null;
}

@InputType()
export class ToggleChecklistItemInputGql {
    @Field(() => ID) taskId!: string;
    @Field(() => ID) itemId!: string;
    @Field(() => Boolean) done!: boolean;
    @Field(() => String, { nullable: true }) byCaregiverId?: string | null;
}

@InputType()
export class UpdateTaskInput {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String,{ nullable: true })
  description?: string;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field(() => TaskPriority,{ nullable: true })
  priority?: TaskPriority;

  @Field(() => String, { nullable: true })
  assignedCaregiverId?: string;

  @Field(() => [ChecklistItemInput], {nullable: true})
  checklist?: ChecklistItemInput[]

  @Field(() => GraphQLDateTime, { nullable: true })
  dueAt?: Date;
}