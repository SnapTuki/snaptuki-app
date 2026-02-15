import { PrismaClient } from "../../../../../generated/prisma";
import { UserRepository } from "../../../application/interfaces/userRepository";
import { User } from "../../../domain/entities/user";
import { toDomain, toPrisma } from "../mappers/userMapper";

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByUserId(id: string): Promise<User | null> {
        const row = await this.prisma.user.findUnique({
            where: { userId: id }
        });
        return toDomain(row);
    }

    async findByEmail(email: string): Promise<User | null> {
        const row = await this.prisma.user.findUnique({ where: { email } });
        return toDomain(row);
    }

    async save(user: User): Promise<void> {
        const data = toPrisma(user);

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
                ...(data.createdAt ? { createdAt: data.createdAt } : {}),
                // updatedAt handled by @updatedAt
            },
            update: {
                email: data.email,
                passwordHash: data.passwordHash,
                roles: data.roles,
                active: data.active,
                firstName: data.firstName,
                lastName: data.lastName,
                agencyId: data.agencyId,
                updatedAt: new Date(),
            },
        });

    }
}