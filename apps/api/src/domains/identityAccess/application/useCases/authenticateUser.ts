import { UserRepository } from "../interfaces/userRepository";
import { PasswordHasher } from "../interfaces/passwordHasher";
import { TokenService } from "../interfaces/tokenService";
import { InvalidCredentials, UserInactive } from "../../domain/errors/errors";
// Import the unified mapper we just built
import { UserMap } from "../../infrastructure/prisma/mappers/userMapper";

export class AuthenticateUser {
    constructor(
        private readonly repo: UserRepository,
        private readonly hasher: PasswordHasher,
        private readonly tokens: TokenService
    ) { }

    async execute(input: { email: string, password: string }) {

        const user = await this.repo.findByEmail(input.email);
        if (!user) throw new InvalidCredentials();

        // 1. Take a snapshot to safely read the entity's current state
        const state = user.snapshot();

        // 2. Use the state to perform your checks
        if(!state.active) throw new UserInactive(); // Fixed: active instead of activate

        const ok = await this.hasher.verify(input.password, state.passwordHash);
        if(!ok) throw new InvalidCredentials();

        // 3. Use the state to generate the JWT
        const token = this.tokens.generate(
            { sub: state.userId, roles: state.roles }, 
            { expiresIn: '24h' }
        );
        
        return {
            token,
            // 4. Use the static mapper we built to safely strip the password
            userId: state.userId,
            roles: state.roles,
            agencyId: state.agencyId,
        };
    }
}