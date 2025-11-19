import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./domains/users/user.resolver";
import { UserService } from "./domains/users/user.service";
import prisma from "./prisma/client";

async function startApolloServer() {

    // initialize services
    const userService = new UserService(prisma);
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