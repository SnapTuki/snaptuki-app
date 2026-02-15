import { UserRepository } from "../interfaces/userRepository";
import { PasswordHasher } from "../interfaces/passwordHasher";
import { TokenService } from "../interfaces/tokenService";
import { InvalidCredentials, UserInactive } from "../../domain/errors/errors";
import { AuthResult } from "../dtos/AuthDTOs";
import { toUserView } from "../dtos/userDTOs";

export class AuthenticateUser {
    constructor(
        private readonly repo: UserRepository,
        private readonly hasher: PasswordHasher,
        private readonly tokens: TokenService
    ) { }

    async execute(input: { email: string, password: string }): Promise<AuthResult> {

        const user = await this.repo.findByEmail(input.email);
        if (!user) throw new InvalidCredentials();
        if(!user.activate) throw new UserInactive();

        const ok = await this.hasher.verify(input.password, user.passwordHash);
        if(!ok) throw new InvalidCredentials();

        const token = this.tokens.generate({sub: user.userId, roles: user.roles}, {expiresIn: '24h'});
        return {
            token,
            user: toUserView({...user.snapshot()}),
        };
    }
}