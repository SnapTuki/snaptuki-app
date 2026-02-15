import { UserRepository } from '../interfaces/userRepository';
import { UserNotFound } from '../../domain/errors/errors';

export class DeactivateUser {
    constructor(
        private readonly repo: UserRepository,
    ) { }

    async execute(input: { userId: string }) {
        const user = await this.repo.findByUserId(input.userId);
        if (!user) throw new UserNotFound();

        user.deactivate();

        await this.repo.save(user);

        return { success: true };
    }
}
``