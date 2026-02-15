import { UserNotFound } from '../../domain/errors/errors';
import { UserRepository } from '../interfaces/userRepository';

export class ActivateUser {
    constructor(
        private readonly repo: UserRepository,
    ) { }

    async execute(input: { userId: string }) {
        const user = await this.repo.findByUserId(input.userId);
        if (!user) throw new UserNotFound();

        user.activate();
        await this.repo.save(user);

        return { success: true };
    }
}
