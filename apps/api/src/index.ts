import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { GraphQLDateTime } from "graphql-scalars";
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
import { BookingResolver, FamilyMemberSummaryResolver } from "./domains/booking/booking.resolver";
import { FamilyProfileResolver } from "./domains/family-profile/family-profile.resolvers";
import { ElderProfileResolver } from "./domains/elder-profile/elder-profile.resolvers";
import { ElderProfileService } from "./domains/elder-profile/elder-profile.service";
import { CareTaskBookService } from "./domains/care-task-book/ctb.service";
import { EmailService } from "./domains/email/email.service";
import { CareServiceService } from "./domains/care-service/care-service.service";
import { CareTaskBookResolver } from "./domains/care-task-book/ctb.resolvers";
import { CareServiceResolver } from "./domains/care-service/care-service.resolvers";
import { CaregiverProfileService } from "./domains/caregiver-profile/cg.service";
import { CaregiverProfileResolver } from "./domains/caregiver-profile/cg.resolvers";
export interface DecodedUserToken {
    id: string;
    email: string;
    role: UserRole; // Used for fast authorization checks
}


async function startApolloServer() {

    // initialize services
    const emailService = new EmailService();
    const authService = new AuthService(prisma, redisClient, emailService);
    const bookingService = new BookingService(prisma);
    const familyProfileService = new FamilyProfileService(prisma);
    const elderProfileService = new ElderProfileService(prisma);
    const careTaskBookService = new CareTaskBookService(prisma);
    const careServiceService = new CareServiceService(prisma);
    const caregiverProfileService = new CaregiverProfileService(prisma);
    // ... Build schema

    const schema = await buildSchema({
        resolvers: [
            AuthResolver,
            BookingResolver,
            FamilyProfileResolver,
            ElderProfileResolver,
            CareTaskBookResolver,
            CareServiceResolver,
            CaregiverProfileResolver,
            FamilyMemberSummaryResolver
        ],

        scalarsMap: [
            { type: Date, scalar: GraphQLDateTime }
        ],
    });


    // ... create server
    const server = new ApolloServer({ schema });

    // start server
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 4000
        },
        context: async ({ req }) => {
            const token = req.headers.authorization || "";
            let user = null;

            if (token) {
                const actualToken = token.replace('Bearer ', '');
                
                try {
                    const payload = jwt.verify(actualToken, config.jwtSecret!);

                    if (typeof payload === 'object' && payload !== null) {
                        // Now TypeScript knows it's an object with an ID
                        user = payload;
                    }else{
                        console.log("Something wrong!")
                    }
                } catch (error) {
                    // token invalid → user stays undefined
                    console.log("User undefnied")
                    user = null;
                }
            }
            return {
                services: {
                    authService,
                    bookingService,
                    familyProfileService,
                    elderProfileService,
                    careTaskBookService,
                    careServiceService,
                    caregiverProfileService
                },
                user
            }
        }
    });

    console.log(`GraphQL server ready at ${url}`);
}

startApolloServer();