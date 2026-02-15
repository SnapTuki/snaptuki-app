import { MiddlewareFn } from 'type-graphql';
import { GraphQLContext } from '../context/graphQLContext';

export function RequireRoles(...allowed: string[]): MiddlewareFn<GraphQLContext> {
    return async ({ context }, next) => {
        if (!context.currentUser) throw new Error('Unauthenticated');
        const userRoles = context.currentUser.roles || [];
        const ok = allowed.some(r => userRoles.includes(r));
        if (!ok) throw new Error('Forbidden');
        return next();
    };
}