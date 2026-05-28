import prisma from "../../../prisma/client";
import { PrismaStaffRepo } from "./repos/PrismaStaffRepo";
import { Argon2PasswordHasher } from "./security/argon2PasswordHasher";

export function createCaregiverManagementContainer() {
    const repo = new PrismaStaffRepo(prisma);
    const hasher = new Argon2PasswordHasher();

    return {prisma, repo, hasher}
}