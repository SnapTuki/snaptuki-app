// src/domains/residentManagement/api/graphql/types/ResidentTypes.ts
import { GraphQLDateTime, JSONResolver } from "graphql-scalars";
import { ObjectType, Field, ID, registerEnumType, Int } from "type-graphql";
import { 
  ResidentStatus, 
  TaskStatus, 
  TaskPriority, 
  TaskCategory, 
  MobilityLevel, 
  Gender, 
  AllergySeverity 
} from "../../../../../generated/prisma";

// --- REGISTER ENUMS FROM PRISMA ---
// We use the Prisma-generated Enums directly for better type safety
registerEnumType(Gender, { name: "Gender" });
registerEnumType(MobilityLevel, { name: "MobilityLevel" });
registerEnumType(AllergySeverity, { name: "AllergySeverity" });
registerEnumType(ResidentStatus, { name: "ResidentStatus" });
registerEnumType(TaskStatus, { name: "TaskStatus" });
registerEnumType(TaskPriority, { name: "TaskPriority" });
registerEnumType(TaskCategory, { name: "TaskCategory" });

@ObjectType()
export class AllergyType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) reaction!: string;
  @Field(() => AllergySeverity) severity!: AllergySeverity;
  @Field(() => String, { nullable: true }) notes!: string | null;
}

@ObjectType()
export class MedicationType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) dosage!: string;
  @Field(() => String) frequency!: string;
  @Field(() => GraphQLDateTime) startDate!: Date;
  @Field(() => GraphQLDateTime, { nullable: true }) endDate!: Date | null;
  @Field(() => String, { nullable: true }) prescribedBy!: string | null;
}

@ObjectType()
export class EmergencyContactType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) relation!: string;
  @Field(() => String) phone!: string;
  @Field(() => Boolean) isPrimary!: boolean; // Added to match schema
}

// --- NEW TYPES FOR CARE PLAN & HISTORY ---

@ObjectType("ResidentChecklistItem")
export class ChecklistItemType {
  @Field(() => ID) id!: string;
  @Field(() => String) label!: string;
  @Field(() => Boolean) isRequired!: boolean;
  @Field(() => Boolean) isCompleted!: boolean;
  @Field(() => GraphQLDateTime, { nullable: true }) completedAt!: Date | null;
}

@ObjectType()
export class ActionRecordType {
  @Field(() => Int) id!: number;
  @Field(() => JSONResolver, { nullable: true }) value!: any; // Uses JSON scalar
  @Field(() => String, { nullable: true }) notes!: string | null;
  @Field(() => GraphQLDateTime) createdAt!: Date;
}

@ObjectType()
export class TaskTemplateType {
  @Field(() => Int) id!: number;
  @Field(() => String) name!: string;
  @Field(() => TaskCategory) category!: TaskCategory;
  @Field(() => TaskPriority) priority!: TaskPriority;
}

@ObjectType()
export class TaskAssignmentType {
  @Field(() => Int) id!: number;
  @Field(() => Boolean) isActive!: boolean;
  @Field(() => TaskTemplateType) taskTemplate!: TaskTemplateType;
}

@ObjectType('ResidentTask')
export class TaskType {
  @Field(() => ID) id!: string;
  @Field(() => TaskStatus) status!: TaskStatus;
  @Field(() => TaskPriority) priority!: TaskPriority;
  @Field(() => TaskCategory) category!: TaskCategory;
  @Field(() => GraphQLDateTime) dueAt!: Date;
  @Field(() => GraphQLDateTime, { nullable: true }) completedAt!: Date | null;
  @Field(() => String, { nullable: true }) completionNotes!: string | null;
  @Field(() => [ChecklistItemType]) checklist!: ChecklistItemType[];
  @Field(() => [ActionRecordType]) actionRecords!: ActionRecordType[];
}

@ObjectType()
export class ResidentType {
  @Field(() => ID) residentId!: string;
  @Field(() => String) mrn!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => GraphQLDateTime) birthDate!: Date;
  @Field(() => Gender) gender!: Gender;
  @Field(() => ResidentStatus) status!: ResidentStatus;
  @Field(() => MobilityLevel) mobilityLevel!: MobilityLevel;
  @Field(() => String, { nullable: true }) room!: string | null;
  @Field(() => GraphQLDateTime) createdAt!: Date;

  // Relations
  @Field(() => [AllergyType]) allergies!: AllergyType[];
  @Field(() => [MedicationType]) medications!: MedicationType[];
  @Field(() => [EmergencyContactType]) emergencyContacts!: EmergencyContactType[];
  @Field(() => [TaskAssignmentType]) taskAssignments!: TaskAssignmentType[];
  @Field(() => [TaskType]) tasks!: TaskType[];
}