import { CareTaskPriorityGraphQL } from "../graphql/enums/CareTaskPriorityGraphQL";
import { CareTaskStatusGraphQL } from "../graphql/enums/CareTaskStatusGraphQL";
export class CareTaskPriorityGraphQLMapper {

    static toGraphQL(priority: string): CareTaskPriorityGraphQL {
        switch (priority) {
            case 'LOW':
                return CareTaskPriorityGraphQL.LOW;
            case 'NORMAL':
                return CareTaskPriorityGraphQL.NORMAL;
            case 'HIGH':
                return CareTaskPriorityGraphQL.HIGH;
            case 'CRITICAL':
                return CareTaskPriorityGraphQL.CRITICAL;
            default:
                throw new Error(`Unknown priority: ${priority}`);
        }
    }

    static fromGraphQL(priority: CareTaskPriorityGraphQL): string {
        switch (priority) {
            case CareTaskPriorityGraphQL.LOW:
                return 'LOW';
            case CareTaskPriorityGraphQL.NORMAL:
                return 'NORMAL';
            case CareTaskPriorityGraphQL.HIGH:
                return 'HIGH';
            case CareTaskPriorityGraphQL.CRITICAL:
                return 'CRITICAL';
            default:
                throw new Error(`Unknown priority: ${priority}`);
        }
    }
}


export class CareTaskStatusGraphQLMapper {

    static toGraphQL(status: string): CareTaskStatusGraphQL {
        switch (status) {
            case "PLANNED":
                
                return CareTaskStatusGraphQL.PLANNED;

            case "ASSIGNED":
                return CareTaskStatusGraphQL.ASSIGNED;

            case "COMPLETED":
                return CareTaskStatusGraphQL.COMPLETED;

            case "UNABLE_TO_COMPLETE":
                return CareTaskStatusGraphQL.UNABLE_TO_COMPLETE;

            case "NEED_ASSISTANCE":
                return CareTaskStatusGraphQL.NEED_ASSISTANCE;
   

            case "OVERDUE":
                return CareTaskStatusGraphQL.OVERDUE;
       
            case "MISSED":
                return CareTaskStatusGraphQL.MISSED;
          
            case "CANCELLED":
                return CareTaskStatusGraphQL.CANCELLED;

            default:
                throw new Error(`Unsupported CareTask status: ${status}`);
        }
    }

    static fromGraphQL(status: string): string {
       switch (status) {
            case CareTaskStatusGraphQL.PLANNED:
                return "PLANNED";

            case CareTaskStatusGraphQL.ASSIGNED:
                return "ASSIGNED";

            case CareTaskStatusGraphQL.COMPLETED:
                return "COMPLETED";

            case CareTaskStatusGraphQL.UNABLE_TO_COMPLETE:
                return "UNABLE_TO_COMPLETE";

            case CareTaskStatusGraphQL.NEED_ASSISTANCE:
                return "NEED_ASSISTANCE";

            case CareTaskStatusGraphQL.OVERDUE:
                return "OVERDUE";

            case CareTaskStatusGraphQL.MISSED:
                return "MISSED";

            case CareTaskStatusGraphQL.CANCELLED:
                return "CANCELLED";

            default:
                throw new Error(`Unsupported CareTask status: ${status}`);
        }
    }
} 