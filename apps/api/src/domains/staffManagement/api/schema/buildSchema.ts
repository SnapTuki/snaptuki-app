import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

import { StaffResolvers

 } from '../resolvers/StaffResolvers';
import { GraphQLDateTime } from 'graphql-scalars';

export async function buildCaregiverManagementSchema() {
    const schema = await buildSchema({
        resolvers: [StaffResolvers],
        scalarsMap: [
            { type: Date, scalar: GraphQLDateTime }
        ],
        validate: false
    })

    return schema;
}