import { Field, ID, Int, ObjectType, registerEnumType } from "type-graphql";

/* =========================
   ENUMS
========================= */

export enum CareTaskBookStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum CareTaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    SKIPPED = "SKIPPED",
}

registerEnumType(CareTaskBookStatus, {
    name: "CareTaskBookStatus",
});

registerEnumType(CareTaskStatus, {
    name: "CareTaskStatus",
});

/* =========================
   CARE TASK
========================= */

@ObjectType()
export class CareTask {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => CareTaskStatus)
    status: CareTaskStatus;

    @Field(() => String, { nullable: true })
    caregiverNotes?: string;

    @Field(() => Date, { nullable: true })
    completedAt?: Date;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

/* =========================
   CARE TASK BOOK
========================= */

@ObjectType()
export class CareTaskBook {
    @Field(() => ID)
    id: number;

    @Field(() => CareTaskBookStatus)
    status: CareTaskBookStatus;

    /* Relations (IDs only here, full objects can be added later) */

    @Field(() => Int)
    bookingId: number;

    @Field(() => Int)
    caregiverId: number;

    @Field(() => Int)
    elderId: number;

    /* Task execution */

    @Field(() => [CareTask])
    tasks: CareTask[];

    /* Progress tracking */

    @Field(() => Int)
    totalTasks: number;

    @Field(() => Int)
    completedTasks: number;

    @Field(() => Int)
    progressPercentage: number;

    /* Audit */

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

