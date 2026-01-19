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
import { ElderProfileResolver } from "./domains/elder-profile/elder-profile.resolvers";
import { ElderProfileService } from "./domains/elder-profile/elder-profile.service";
import { CareTaskBookService } from "./domains/care-task-book/ctb.service";
import { EmailService } from "./domains/email/email.service";
import { CareServiceService } from "./domains/care-service/care-service.service";
import { CareTaskBookResolver } from "./domains/care-task-book/ctb.resolvers";
import { CareServiceResolver } from "./domains/care-service/care-service.resolvers";
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
    // ... Build schema

    const schema = await buildSchema({
        resolvers: [
            AuthResolver, 
            BookingResolver, 
            FamilyProfileResolver, 
            ElderProfileResolver, 
            CareTaskBookResolver, 
            CareServiceResolver]
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
                    elderProfileService,
                    careTaskBookService,
                    careServiceService
                },
                user
            }
        }
    });

    console.log(`GraphQL server ready at ${url}`);
}

startApolloServer();