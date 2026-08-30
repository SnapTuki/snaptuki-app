import { registerEnumType } from "type-graphql";

export enum CareTaskPriorityGraphQL {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

registerEnumType(CareTaskPriorityGraphQL, {
  name: "CareTaskPriority",
  description: "The priority level of a care task.",
});