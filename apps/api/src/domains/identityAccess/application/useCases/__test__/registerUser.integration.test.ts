import { describe, it, expect, beforeEach, vi } from "vitest";
import prisma from "../../../../../prisma/client";
import { RegisterUser } from "../registerUser";
import { EmailAlreadyRegistered } from "../../../domain/errors/errors";

import { PrismaUserRepository } from "../../../infrastructure/prisma/repos/prismaUserRepository";

const mockPasswordHasher = {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    verify: vi.fn()
}

describe('RegisterUser Use Case Integration Test', () => {

    let useCase: RegisterUser;
    let repo: PrismaUserRepository;

    beforeEach(async () => {
        await prisma.user.deleteMany(); // Clean up the users table before each test
        repo = new PrismaUserRepository(prisma);
        useCase = new RegisterUser(repo, mockPasswordHasher);
    });

    it('should successfully register a new user and physically save them to the database', async () => {
        const input = {
            email: 'test.caregiver@snaptuki.fi',
            password: 'StrongPassword123!',
            firstName: 'test',
            lastName: 'caregiver'
        };
        const result = await useCase.execute(input);
        // Assert 1: The Use Case returns the correct DTO
        expect(result.user).toBeDefined();
        expect(result.user.email).toBe(input.email);
        expect(result.user.firstName).toBe(input.firstName);

        // Assert 2: The Infrastructure Layer actually saved it to PostgreSQL
        const savedUserInDb = await prisma.user.findUnique({
            where: { email: input.email }
        });
        expect(savedUserInDb).not.toBeNull();
        expect(savedUserInDb?.email).toBe(input.email);
        expect(savedUserInDb?.passwordHash).toBe('hashed_password');
        expect(savedUserInDb?.firstName).toBe(input.firstName);
        expect(savedUserInDb?.lastName).toBe(input.lastName);
    });

    it('should throw EmailAlreadyRegistered error if the email is already in use', async () => {
        const input = {
            email: 'existing@snaptuki.com',
            password: 'StrongPassword123!',
            firstName: 'Existing',
            lastName: 'User'
        };

        // Act 1: Save the user the first time (this will succeed)
        await useCase.execute(input);

        // Act 2 & Assert: Try to save the exact same email again
        await expect(() => useCase.execute(input)).rejects.toThrow(EmailAlreadyRegistered);
        
        // Assert 3: Verify the database didn't accidentally save a duplicate
        const dbUsers = await prisma.user.findMany({
            where: { email: input.email }
        });
        expect(dbUsers.length).toBe(1);
    });
});