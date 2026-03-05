import { MiddlewareFn } from "type-graphql";
import { GraphQLContext } from "../../../../lib/graphqlContext";

export const RequireAuth: MiddlewareFn<GraphQLContext> = async ({context}, next) => {
    if(!context.currentUser) throw new Error('Authentication Required');
    return next();
}