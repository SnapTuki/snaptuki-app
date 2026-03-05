import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { AuthenticateInput } from '../inputs/authenticateInput';
import { AuthResultGQL } from '../types/authGQL';
import { RegisterUserInput } from '../inputs/registerUserInput';
import { UserGQL } from '../types/userGQL';

// Import use-cases (application layer)
import { AuthenticateUser } from '../../application/useCases/authenticateUser';
import { RegisterUser } from '../../application/useCases/registerUser';

import { GraphQLContext } from '../../../../lib/graphqlContext';

@Resolver()
export class AuthResolver {

    @Mutation(() => AuthResultGQL)
    async authenticateUser(
        @Arg('input', () => AuthenticateInput) input: AuthenticateInput,
        @Ctx() ctx: GraphQLContext
    ): Promise<AuthResultGQL> {
        const { repo, hasher, tokens } = ctx.identityAccess;
        const uc = new AuthenticateUser(repo, hasher, tokens);

        const result = await uc.execute({ email: input.email, password: input.password });

        return {
            token: result.token,
            user: {
                ...result.user,
            } as unknown as UserGQL,
        };
    }

    @Mutation(() => UserGQL)
    async registerUser(
        @Arg('input', () => RegisterUserInput) input: RegisterUserInput,
        @Ctx() ctx: GraphQLContext
    ): Promise<UserGQL> {
        const { repo, hasher } = ctx.identityAccess;
        const uc = new RegisterUser(repo, hasher);

        const { user } = await uc.execute({
            email: input.email,
            password: input.password,
            roles: input.roles as any,
            firstName: input.firstName,
            lastName: input.lastName,
            agencyId: input.agencyId,
        });

        return user as unknown as UserGQL;
    }
}