import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { TaskPriority, TaskStatus, TaskCategory} from "../../../../../generated/prisma";
import { GraphQLDateTime } from "graphql-scalars";
import { ResidentType } from "../../../../residentManagement/api/graphql/types/ResidentTypes";
import { VisitStatus } from "../../../../../generated/prisma";
import { CaregiverType } from "../../../../caregiverManagement/api/types/CaregiverType";

// Register Prisma Enums so Type-GraphQL understands them
registerEnumType(TaskPriority, { name: "TaskPriority" });
registerEnumType(TaskStatus, { name: "TaskStatus" });
registerEnumType(TaskCategory, { name: "TaskCategory" });
registerEnumType(VisitStatus, { name: "VisitStatus" });

@ObjectType('TaskChecklistItem')
export class ChecklistItemType {
  @Field(() => ID) id!: string;
  @Field(() => String) label!: string;
  @Field(() => Boolean) isRequired!: boolean; // Matched to Prisma 'isRequired'
  @Field(() => Boolean) isCompleted!: boolean; // Matched to Prisma 'isCompleted'
  @Field(() => GraphQLDateTime, { nullable: true }) completedAt!: Date | null;
}

@ObjectType('Task')
export class TaskType {
  @Field(() => ID) id!: string;
  
  // These are derived from TaskTemplate in your schema
  @Field(() => String) title!: string; 
  @Field(() => String, { nullable: true }) description!: string | null;

  @Field(() => TaskCategory) category!: TaskCategory;
  @Field(() => TaskPriority) priority!: TaskPriority;
  @Field(() => TaskStatus) status!: TaskStatus;

  @Field(() => String) residentId!: string; // Required in Prisma
  // ADD THIS: To allow querying the resident object
  @Field(() => ResidentType, { nullable: true })
  resident?: ResidentType; 

  // ADD THIS: To allow querying the visit and caregiver
  @Field(() => VisitType, { nullable: true })
  visit?: VisitType;

  // Note: assignedCaregiverId likely comes from the linked Visit
  @Field(() => String, { nullable: true }) assignedCaregiverId!: string | null;

  @Field(() => GraphQLDateTime, {nullable: true}) dueAt!: Date; // Required in Prisma
  @Field(() => GraphQLDateTime, { nullable: true }) startedAt!: Date | null;
  @Field(() => GraphQLDateTime, { nullable: true }) completedAt!: Date | null;
  @Field(() => String, { nullable: true }) completionNotes!: string | null;

  @Field(() => [ChecklistItemType]) checklist!: ChecklistItemType[];

  // Mark as nullable if not yet added to Prisma schema
  @Field(() => String, { nullable: true }) createdByUserId!: string | null; 
  
  @Field(() => GraphQLDateTime) createdAt!: Date;
  @Field(() => GraphQLDateTime) updatedAt!: Date;
}

@ObjectType("Visit")
export class VisitType {
  @Field(() => ID)
  visitId!: string;

  @Field(() => VisitStatus)
  status!: VisitStatus;

  @Field(() => GraphQLDateTime)
  scheduledStart!: Date;

  @Field(() => GraphQLDateTime)
  scheduledEnd!: Date;

  @Field(() => GraphQLDateTime, { nullable: true })
  actualStart?: Date | null;

  @Field(() => GraphQLDateTime, { nullable: true })
  actualEnd?: Date | null;

  // Relationships
  @Field(() => ResidentType)
  resident!: ResidentType;

  @Field(() => CaregiverType)
  caregiver!: CaregiverType;

  @Field(() => [TaskType])
  tasks!: TaskType[];

  @Field(() => GraphQLDateTime)
  createdAt!: Date;

  @Field(() => GraphQLDateTime)
  updatedAt!: Date;
}