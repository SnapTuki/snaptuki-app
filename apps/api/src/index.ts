import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./domains/auth/auth.resolver";
import { AuthService } from "./domains/auth/auth.service";
import prisma from "./prisma/client";
import { redisClient } from "./lib/redis";
import jwt from "jsonwebtoken";
import { config } from "./config";
import { UserRole } from "./domains/auth/auth.types";
import { BookingService } from "./domains/booking/booking.service";
import { FamilyProfileService } from "./domains/family-profile/family-profile.service";
import { BookingResolver } from "./domains/booking/booking.resolver";
import { FamilyProfileResolver } from "./domains/family-profile/family-profile.resolvers";

export interface DecodedUserToken {
  id: string;
  email: string;
  role: UserRole; // Used for fast authorization checks
}


async function startApolloServer() {

    // initialize services
    const authService = new AuthService(prisma, redisClient);
    const bookingService = new BookingService(prisma);
    const familyProfileService = new FamilyProfileService(prisma);
    // ... Build schema

    const schema = await buildSchema({
        resolvers: [AuthResolver, BookingResolver, FamilyProfileResolver]
    });


    // ... create server
    const server = new ApolloServer({ schema });

    // start server
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 4000
        },
        context: async ({ req }) => {
            const auth = req.headers.authorization || "";
            let user = null;

            if (auth.startsWith("Bearer ")) {
                const token = auth.split(" ")[1];
                try {
                    const payload = jwt.verify(token, config.jwtSecret!) as DecodedUserToken;
                    user = payload
                } catch (error) {
                    // token invalid → user stays undefined
                    user = null;
                }
            }
            return {
                services: {
                    authService,
                    bookingService,
                    familyProfileService,
                },
                user
            }
        }
    });

    console.log(`GraphQL server ready at ${url}`);
}

startApolloServer();