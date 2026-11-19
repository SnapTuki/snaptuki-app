import { registerEnumType } from "type-graphql";

export enum CareTaskStatusGraphQL {
  PLANNED = "PLANNED",
  ASSIGNED = "ASSIGNED",
  COMPLETED = "COMPLETED",
  UNABLE_TO_COMPLETE = "UNABLE_TO_COMPLETE",
  NEED_ASSISTANCE = "NEED_ASSISTANCE",
  OVERDUE = "OVERDUE",
  MISSED = "MISSED",
  CANCELLED = "CANCELLED",
}

registerEnumType(CareTaskStatusGraphQL, {
  name: "CareTaskStatus",
  description: "The current lifecycle status of a care task.",
});