import { UserRepository } from "../interfaces/userRepository";
import { PasswordHasher } from "../interfaces/passwordHasher";
import { DefaultPasswordPolicy } from "../../domain/services/passwordPolicy.service";
import { Email } from "../../domain/valueObjects/email.vo";
import { EmailAlreadyRegistered } from "../../domain/errors/errors";
import { Role } from "../../domain/valueObjects/role.vo";
import { UserMap } from "../../infrastructure/prisma/mappers/userMapper";
import { User } from "../../domain/entities/user";

export class RegisterUser {
    constructor(
        private readonly repo: UserRepository,
        private readonly hasher: PasswordHasher,
        private readonly passwordPolicy = new DefaultPasswordPolicy()
    ) { }

    async execute(
        input: {
            email: string;
            password: string;
            roles?: Role[];
            firstName: string;
            lastName: string;
            agencyId?: number;
        }
    ) {
        this.passwordPolicy.ensureStrong(input.password);
        const existing = await this.repo.findByEmail(input.email);
        if (existing) throw new EmailAlreadyRegistered();

        const passwordHash = await this.hasher.hash(input.password);
        const user = User.createNew({
            userId: crypto.randomUUID(),
            email: Email.create(input.email),
            passwordHash,
            roles: input.roles,
            firstName: input.firstName,
            lastName: input.lastName,
            agencyId: input.agencyId,

        });

        await this.repo.save(user);

        return { user: UserMap.toDTO(user) }
    }
}