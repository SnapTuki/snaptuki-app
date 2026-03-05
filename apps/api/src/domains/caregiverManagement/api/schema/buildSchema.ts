import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

import { CaregiverResolver

 } from '../resolvers/CaregiverResolvers';
import { GraphQLDateTime } from 'graphql-scalars';

export async function buildCaregiverManagementSchema() {
    const schema = await buildSchema({
        resolvers: [CaregiverResolver],
        scalarsMap: [
            { type: Date, scalar: GraphQLDateTime }
        ],
        validate: false
    })

    return schema;
}