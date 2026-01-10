import { Field, InputType, Int } from "type-graphql";
import { CareTaskStatus } from "./ctb-types";

/* =========================
   CREATE TASK BOOK
   (Triggered when booking is CONFIRMED)
========================= */

@InputType()
export class CreateCareTaskBookInput {
  @Field(() => Int)
  bookingId: number;

  @Field(() => Int)
  caregiverId: number;

  @Field(() => Int)
  elderId: number;
}

/* =========================
   CREATE TASK
   (System-generated or admin-defined)
========================= */

@InputType()
export class CreateCareTaskInput {
  @Field(() => Int)
  taskBookId: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}

/* =========================
   UPDATE TASK STATUS
   (Caregiver action)
========================= */

@InputType()
export class UpdateCareTaskStatusInput {
  @Field(() => Int)
  taskId: number;

  @Field(() => CareTaskStatus)
  status: CareTaskStatus;

  @Field({ nullable: true })
  caregiverNotes?: string;
}

/* =========================
   COMPLETE TASK BOOK
   (System-validated)
========================= */

@InputType()
export class CompleteCareTaskBookInput {
  @Field(() => Int)
  taskBookId: number;
}
