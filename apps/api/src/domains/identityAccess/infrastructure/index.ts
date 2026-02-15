import prisma from "../../../prisma/client";
import { PrismaUserRepository } from "./prisma/repos/prismaUserRepository";
import { Argon2PasswordHasher } from "./security/argon2PasswordHasher";
import { JwtTokenService } from "./security/jwtTokenService";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
import { config } from "../../../config";


export function createIdentityAccessContainer() {
    const repo = new PrismaUserRepository(prisma);
    const hasher = new Argon2PasswordHasher();
    const tokens = new JwtTokenService(config.jwtSecret);

    return {prisma, repo, hasher, tokens}
}