import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./domains/users/user.resolver";
import { UserService } from "./domains/users/user.service";
import prisma from "./prisma/client";
import { redisClient } from "./lib/redis";


async function startApolloServer() {

    // initialize services
    const userService = new UserService(prisma, redisClient);
    // ... Build schema

    const schema = await buildSchema({
        resolvers: [UserResolver]
    });


    // ... create server
    const server = new ApolloServer({ schema });

    // start server
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 4000
        },
        context: async() => {
            return{
                services: {
                    userService,
                }
            }
        }
    });

    console.log(`GraphQL server ready at ${url}`);
}

startApolloServer();