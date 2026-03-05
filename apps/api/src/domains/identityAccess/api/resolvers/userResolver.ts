import { Arg, Ctx, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { UserGQL } from '../types/userGQL';
import { AssignRoleInput } from '../inputs/assignRoleInput';
import { RevokeRoleInput } from '../inputs/revokeRoleInput';
import { ChangePasswordInput } from '../inputs/changePasswordInput';
import { ActivateUserInput } from '../inputs/activateUserInput';
//import { DeactivateUserInput } from '../inputs/';

import { AssignRole } from '../../application/useCases/assignRole';
//import { RevokeRole } from '../../application/useCases/revokeRole';
import { ChangePassword } from '../../application/useCases/changePassword';
import { ActivateUser } from '../../application/useCases/activateUser';
//import { DeactivateUser } from '../../application/use-cases/DeactivateUser';

import {GraphQLContext} from '../../../../lib/graphqlContext';
import { RequireAuth } from '../middlewares/authMiddleware';
import { RequireRoles } from '../middlewares/roleGuards';

@Resolver(() => UserGQL)
export class UserResolver {
  @Query(() => UserGQL, { nullable: true })
  @UseMiddleware(RequireAuth)
  async me(@Ctx() ctx: GraphQLContext): Promise<UserGQL | null> {
    const { currentUser } = ctx;
    if (!currentUser) return null;

    const { repo } = ctx.identityAccess;
    const u = await repo.findByUserId(currentUser.userId);
    if (!u) return null;

    const s = u.snapshot();
    return {
      userId: s.userId,
      email: s.email,
      roles: s.roles as any,
      active: s.active,
      firstName: s.firstName ?? null,
      lastName: s.lastName ?? null,
      agencyId: s.agencyId ?? null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }

  @Mutation(() => UserGQL)
  @UseMiddleware(RequireAuth, RequireRoles('SUPER_ADMIN', 'SUPERVISOR'))
  async assignRole(
    @Arg('input', ()=>AssignRoleInput) input: AssignRoleInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<UserGQL> {
    const { repo } = ctx.identityAccess;
    const uc = new AssignRole(repo);
    const { user } = await uc.execute({ userId: input.userId, role: input.role as any });
    return user as unknown as UserGQL;
  }

//   @Mutation(() => UserGQL)
//   @UseMiddleware(RequireAuth, RequireRoles('SUPER_ADMIN', 'SUPERVISOR'))
//   async revokeRole(
//     @Arg('input') input: RevokeRoleInput,
//     @Ctx() ctx: GraphQLContext
//   ): Promise<UserGQL> {
//     const { repo, events, uow } = ctx.identityAccess;
//     const uc = new RevokeRole(repo, events, uow);
//     const { user } = await uc.execute({ userId: input.userId, role: input.role as any });
//     return user as unknown as UserGQL;
//   }

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

//   @Mutation(() => Boolean)
//   @UseMiddleware(RequireAuth, RequireRoles('SUPER_ADMIN'))
//   async deactivateUser(
//     @Arg('input') input: DeactivateUserInput,
//     @Ctx() ctx: GraphQLContext
//   ): Promise<boolean> {
//     const { repo, events, uow } = ctx.identityAccess;
//     const uc = new DeactivateUser(repo, events, uow);
//     await uc.execute({ userId: input.userId });
//     return true;
//   }

  @Mutation(() => Boolean)
  @UseMiddleware(RequireAuth, RequireRoles('SUPER_ADMIN'))
  async activateUser(
    @Arg('input', () => ActivateUserInput) input: ActivateUserInput,
    @Ctx() ctx: GraphQLContext
  ): Promise<boolean> {
    const { repo } = ctx.identityAccess;
    const uc = new ActivateUser(repo);
    await uc.execute({ userId: input.userId });
    return true;
  }

  // Optional: add findUserByEmail, listUsers with pagination, etc.
}