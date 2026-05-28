// src/domains/taskManagement/api/graphql/inputs/TaskInputs.ts

import { InputType, Field, ID } from "type-graphql";
import { GraphQLDateTime } from "graphql-scalars";

// 1. IMPORT ENUMS EXCLUSIVELY FROM THE DOMAIN
import { TaskCategory, TaskPriority } from "../../../domain/entities/Task";

@InputType()
export class CreateChecklistItemInput {
    // No ID field! The Use Case generates the UUID securely.
    @Field(() => String) label!: string;
    @Field(() => Boolean, { nullable: true, defaultValue: false }) required?: boolean;
}

@InputType()
export class CreateTaskInput {
    @Field(() => String) title!: string;
    @Field(() => String, { nullable: true }) description?: string | null;
    
    // REMOVED: status (Domain handles this)
    
    @Field(() => TaskCategory) category!: TaskCategory;
    @Field(() => TaskPriority) priority!: TaskPriority;
    
    @Field(() => String) residentId!: string;
    @Field(() => String) assignedCaregiverId!: string;
    
    @Field(() => GraphQLDateTime) dueAt!: Date;
    
    @Field(() => [CreateChecklistItemInput], { nullable: true }) checklist?: CreateChecklistItemInput[] | null;
}

@InputType()
export class CompleteTaskInputGql {
    @Field(() => ID) id!: string;
    @Field(() => ID) completedByCaregiverId!: string;
    
    // FIXED: Mapped explicitly as a GraphQL String Array
    @Field(() => [String], { nullable: true }) notes?: string[] | null;
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
  @Field(() => ID) id!: string;

  @Field(() => String, { nullable: true }) title?: string;
  @Field(() => String, { nullable: true }) description?: string;

  // REMOVED: status (Must trigger explicit domain behaviors)
  // REMOVED: checklist (Must use Toggle/Add Use Cases)

  @Field(() => TaskPriority, { nullable: true }) priority?: TaskPriority;
  @Field(() => String, { nullable: true }) assignedCaregiverId?: string | null;
  @Field(() => GraphQLDateTime, { nullable: true }) dueAt?: Date | null;
}