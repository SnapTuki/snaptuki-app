import prisma from "../../../prisma/client";
import { PrismaTaskRepo } from "./repos/PrismaTaskRepo";
export function createTaskManagementContainer() {
    const repo = new PrismaTaskRepo(prisma);
    return {
        prisma,
        repo
    }
}