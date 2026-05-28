// apps/backend/src/domains/identityAccess/infrastructure/prisma/repositories/PrismaUserRepository.ts

import { PrismaClient } from "../../../../../generated/prisma";
import { UserRepository } from "../../../application/interfaces/userRepository";
import { User } from "../../../domain/entities/user";
import { UserMap } from "../mappers/userMapper";

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByUserId(id: string): Promise<User | null> {
        const row = await this.prisma.user.findUnique({
            where: { userId: id }
        });
        return UserMap.toDomain(row);
    }

    async findByEmail(email: string): Promise<User | null> {
        const row = await this.prisma.user.findUnique({ 
            where: { email } 
        });
        return UserMap.toDomain(row);
    }

    async save(user: User): Promise<void> {
        const data = UserMap.toPrisma(user);

        await this.prisma.user.upsert({
            where: { userId: data.userId },
            create: {
                userId: data.userId,
                email: data.email,
                passwordHash: data.passwordHash,
                roles: data.roles,
                active: data.active,
                firstName: data.firstName,
                lastName: data.lastName,
                agencyId: data.agencyId,
                createdAt: data.createdAt, 
                updatedAt: data.updatedAt, // Trust the domain's initial creation time
            },
            update: {
                email: data.email,
                passwordHash: data.passwordHash,
                roles: data.roles,
                active: data.active,
                firstName: data.firstName,
                lastName: data.lastName,
                agencyId: data.agencyId,
                updatedAt: data.updatedAt, // Trust the domain's mutation time!
            },
        });
    }
}