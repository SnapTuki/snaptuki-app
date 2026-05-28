import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { UserAuthData } from '../types/userAuthData';
import { ChangePasswordInput } from '../inputs/changePasswordInput';

import { ChangePassword } from '../../application/useCases/changePassword';

import {GraphQLContext} from '../../../../lib/graphqlContext';
import { RequireAuth } from '../middlewares/authMiddleware';
import { UserRole } from '../types/userAuthData';
@Resolver(() => UserAuthData)
export class UserResolver {
  @Query(() => UserAuthData, { nullable: true })
  @UseMiddleware(RequireAuth)
  async me(@Ctx() ctx: GraphQLContext): Promise<UserAuthData | null> {
    const { currentUser } = ctx;
    if (!currentUser) return null;
    return {
      userId: currentUser.userId,
      roles: currentUser.roles.map(role => role as UserRole),
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(RequireAuth)
  async changePassword(
    @Arg('input', () => ChangePasswordInput) input: ChangePasswordInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    const { repo, hasher } = ctx.identityAccess;
    const uc = new ChangePassword(repo, hasher);
    await uc.execute({ userId: input.userId, newPassword: input.newPassword });
    return true;
  }

}