// src/domains/taskManagement/api/graphql/types/TaskTypes.ts

import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { GraphQLDateTime } from "graphql-scalars";

// 1. IMPORT ENUMS STRICTLY FROM THE DOMAIN
import { TaskPriority, TaskStatus, TaskCategory } from "../../../domain/entities/Task";

// Register Domain Enums
registerEnumType(TaskPriority, { name: "TaskPriority" });
registerEnumType(TaskStatus, { name: "TaskStatus" });
registerEnumType(TaskCategory, { name: "TaskCategory" });

@ObjectType('TaskChecklistItem')
export class ChecklistItemType {
  @Field(() => ID) id!: string;
  @Field(() => String) label!: string;
  
  // 2. MATCH EXACTLY TO THE DTO OUTPUT
  @Field(() => Boolean) required!: boolean; 
  @Field(() => Boolean) done!: boolean; 
  @Field(() => GraphQLDateTime, { nullable: true }) doneAt!: Date | null;
  @Field(() => String, { nullable: true }) doneByCaregiverId!: string | null;
}

// 3. LIGHTWEIGHT CROSS-CONTEXT PROFILES (Matching your DTO)
@ObjectType('TaskCaregiverProfile')
export class TaskCaregiverProfileType {
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
}

@ObjectType('TaskResidentProfile')
export class TaskResidentProfileType {
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
}

@ObjectType('Task')
export class TaskType {
  @Field(() => ID) id!: string;
  
  @Field(() => String) title!: string; 
  @Field(() => String, { nullable: true }) description?: string | null;

  @Field(() => TaskCategory) category!: TaskCategory;
  @Field(() => TaskPriority) priority!: TaskPriority;
  @Field(() => TaskStatus) status!: TaskStatus;

  @Field(() => String, { nullable: true }) residentId?: string | null;
  @Field(() => TaskResidentProfileType, { nullable: true }) assignedResident?: TaskResidentProfileType | null; 

  @Field(() => String, { nullable: true }) assignedCaregiverId?: string | null;
  @Field(() => TaskCaregiverProfileType, { nullable: true }) assignedCaregiver?: TaskCaregiverProfileType | null;

  @Field(() => GraphQLDateTime, { nullable: true }) dueAt?: Date | null; 
  @Field(() => GraphQLDateTime, { nullable: true }) startedAt?: Date | null;
  @Field(() => GraphQLDateTime, { nullable: true }) completedAt?: Date | null;
  
  @Field(() => String, { nullable: true }) completedByCaregiverId?: string | null;
  @Field(() => [String], { nullable: true }) completionNotes?: string[] | null;

  @Field(() => [ChecklistItemType]) checklist!: ChecklistItemType[];

  @Field(() => String) createdByUserId!: string; 
  
  @Field(() => GraphQLDateTime) createdAt!: Date;
  @Field(() => GraphQLDateTime) updatedAt!: Date;
}