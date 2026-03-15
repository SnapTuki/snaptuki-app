// src/domains/taskManagement/api/graphql/inputs/TaskInputs.ts
import { InputType, Field, ID } from "type-graphql";
import { TaskCategory, TaskPriority } from "../../../../../generated/prisma";
import { GraphQLDateTime } from "graphql-scalars";
@InputType()
export class ChecklistItemInput {
    @Field(() => ID) id!: string;
    @Field(() => String) label!: string;
    @Field(() => Boolean, { nullable: true }) required?: boolean;
}

@InputType()
export class AssignTaskInputGql {
    @Field(() => ID) id!: string;
    @Field(() => String) title!: string;
    @Field(() => String, { nullable: true }) description?: string | null;
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
    @Field(() => String, { nullable: true }) notes?: string | null;
}

@InputType()
export class ToggleChecklistItemInputGql {
    @Field(() => ID) taskId!: string;
    @Field(() => ID) itemId!: string;
    @Field(() => Boolean) done!: boolean;
    @Field(() => String, { nullable: true }) byCaregiverId?: string | null;
}