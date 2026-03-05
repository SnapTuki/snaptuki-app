import prisma from "../../../prisma/client";
import { PrismaCaregiverRepo } from "./repos/PrismaCaregiverRepo";
import { Argon2PasswordHasher } from "./security/argon2PasswordHasher";

export function createCaregiverManagementContainer() {
    const repo = new PrismaCaregiverRepo(prisma);
    const hasher = new Argon2PasswordHasher();

    return {prisma, repo, hasher}
}