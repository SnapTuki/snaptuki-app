import { GraphQLError } from "graphql"

import { PrismaClient } from "../../generated/prisma/client"
import { createToken } from "../../utils/auth"


const prisma = new PrismaClient()
// Helper function for random 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Expiration: 10 minutes
const EXPIRY_MINUTES = 10;

export const authResolvers = {
    Mutation: {
        initialRegister: async (_: any, args: any) => {

            //check if user already registered
            let user = await prisma.users.findUnique({ where: { email: args.data.email } })
            if (user) {
                throw new GraphQLError("Email already registered", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.data
                    }
                })
            }


            //Register user with email
            if (!user) {
                user = await prisma.users.create({
                    data: {
                        email: args.data.email
                    }
                })
            }

            // Generate a 6-digit code and expiry
            const code = generateCode();
            const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);


            // Create new verification code

            await prisma.authtokens.create({
                data: {
                    user_id: user.user_id,
                    verification_title: "Email Verification",
                    code: code,
                    expires_at: expiresAt,
                }
            })

            // MVP: Log code to console (later replace with email/SMS)
            console.log(`🔐 Verification code for ${args.data.email}: ${code}`);

            return true;

        }
    }
}