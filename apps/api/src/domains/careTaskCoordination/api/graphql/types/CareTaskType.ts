import { Field, ID, ObjectType } from "type-graphql";
import { CareTaskPriorityGraphQL } from "../enums/CareTaskPriorityGraphQL";
import { CareTaskStatusGraphQL } from "../enums/CareTaskStatusGraphQL";
import {GraphQLDateTime} from "graphql-scalars";

@ObjectType("CareTask")
export class CareTaskType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String,{ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  residentId?: string;

  @Field(() => ID, { nullable: true })
  assignedCaregiverId?: string;

  @Field(() => CareTaskPriorityGraphQL)
  priority!: CareTaskPriorityGraphQL;

  @Field(() => CareTaskStatusGraphQL)
  status!: CareTaskStatusGraphQL;

  @Field(() => GraphQLDateTime)
  dueTime!: Date;

  @Field(() => GraphQLDateTime)
  createdAt!: Date;

  @Field(() => GraphQLDateTime, { nullable: true })
  completedAt?: Date;
}

@ObjectType("CareTaskDetails")
export class CareTaskDetailsType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => CareTaskPriorityGraphQL)
  priority!: CareTaskPriorityGraphQL;

  @Field(() => CareTaskStatusGraphQL)
  status!: CareTaskStatusGraphQL;

  @Field(() => GraphQLDateTime)
  dueTime!: Date;

  @Field(() => String, { nullable: true })
  completionNote?: string | null;

  @Field(() => AssignedToCaregiverType, { nullable: true })
  assignedToCaregiver?: AssignedToCaregiverType | null;

  @Field(() => AssignedToResidentType, { nullable: true })
  assignedToResident?: AssignedToResidentType | null;
}

@ObjectType("CareTaskListItem")
export class CareTaskListItemType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => CareTaskPriorityGraphQL)
  priority!: CareTaskPriorityGraphQL;

  @Field(() => CareTaskStatusGraphQL)
  status!: CareTaskStatusGraphQL;

  @Field(() => GraphQLDateTime)
  dueTime!: Date;

  @Field(() => AssignedToCaregiverType, { nullable: true })
  assignedToCaregiver!: AssignedToCaregiverType | null;

  @Field(() => AssignedToResidentType, { nullable: true })
  assignedToResident!: AssignedToResidentType | null;
}

@ObjectType("AssignedToCaregiver")
export class AssignedToCaregiverType {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;
}

@ObjectType("AssignedToResident")
export class AssignedToResidentType {
  @Field(() => ID)
  residentId!: string;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;
}

