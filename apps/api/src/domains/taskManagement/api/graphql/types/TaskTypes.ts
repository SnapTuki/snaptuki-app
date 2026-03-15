// src/domains/taskManagement/api/graphql/types/TaskTypes.ts
import { ObjectType, Field, ID } from "type-graphql";
import { TaskPriority, TaskStatus, TaskCategory } from "../../../../../generated/prisma";
import { GraphQLDateTime } from "graphql-scalars";

@ObjectType()
export class ChecklistItemType {
  @Field(() => ID) id!: string;
  @Field(() => String) label!: string;
  @Field(() => Boolean) required!: boolean;
  @Field(() => Boolean) done!: boolean;
  @Field(() => GraphQLDateTime, { nullable: true }) doneAt!: Date | null;
  @Field(() => String, { nullable: true }) doneByCaregiverId!: string | null;
}

@ObjectType()
export class TaskType {
  @Field(() => ID) id!: string;
  @Field(() => String) title!: string;
  @Field(() => String,{ nullable: true }) description!: string | null;
  @Field(() => TaskCategory) category!: TaskCategory;
  @Field(() => TaskPriority) priority!: TaskPriority;
  @Field(() => TaskStatus) status!: TaskStatus;

  @Field(() => String, { nullable: true }) residentId!: string | null;
  @Field(() => String, { nullable: true }) assignedCaregiverId!: string | null;

  @Field(() => GraphQLDateTime, { nullable: true }) dueAt!: Date | null;
  @Field(() => GraphQLDateTime,{ nullable: true }) startedAt!: Date | null;
  @Field(() => GraphQLDateTime,{ nullable: true }) completedAt!: Date | null;
  @Field(() => String, { nullable: true }) completedByCaregiverId!: string | null;
  @Field(() => String, { nullable: true }) completionNotes!: string | null;

  @Field(() => [ChecklistItemType]) checklist!: ChecklistItemType[];

  @Field(() => String) createdByUserId!: string;
  @Field(() => GraphQLDateTime,) createdAt!: Date;
  @Field(() => GraphQLDateTime,) updatedAt!: Date;
}