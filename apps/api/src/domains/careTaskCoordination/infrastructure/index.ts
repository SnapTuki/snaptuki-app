import prisma from "../../../prisma/client";
import { PrismaCareTaskRepository } from "./repos/PrismaTaskRepo";
export function createTaskManagementContainer() {
    const repo = new PrismaCareTaskRepository(prisma);
    return {
        prisma,
        repo
    }
}