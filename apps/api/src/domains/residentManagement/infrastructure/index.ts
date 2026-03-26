import prisma from "../../../prisma/client";
import { PrismaResidentRepo } from "./repos/PrismaResidentRepo";

export function createResidentManagementContainer(){
    const repo = new PrismaResidentRepo(prisma);
    return {prisma, repo};
}