import { UserRepository } from "../interfaces/userRepository";
import { PasswordHasher } from "../interfaces/passwordHasher";
import { DefaultPasswordPolicy } from "../../domain/services/passwordPolicy.service";
import { UserNotFound } from "../../domain/errors/errors";

export class ChangePassword {
    constructor(
        private readonly repo: UserRepository,
        private readonly hashser: PasswordHasher,
        private readonly passwordPolicy = new DefaultPasswordPolicy(),
    ) { }

    async execute(input: { userId: string, newPassword: string }) {

        this.passwordPolicy.ensureStrong(input.newPassword);

        const user = await this.repo.findByUserId(input.userId);
        if (!user) throw new UserNotFound();

        const newHash = await this.hashser.hash(input.newPassword);
        user.changePasswordHash(newHash);

        await this.repo.save(user);

        return { success: true };
    }
}