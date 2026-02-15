import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

import { AuthResolver } from '../resolvers/authResolver';
import { UserResolver } from '../resolvers/userResolver';
import { GraphQLDateTime } from 'graphql-scalars';

export async function buildIdentityAccessSchema() {
    const schema = await buildSchema({
        resolvers: [AuthResolver, UserResolver],
        scalarsMap: [
            { type: Date, scalar: GraphQLDateTime }
        ],
        validate: false
    })

    return schema;
}