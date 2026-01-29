import "reflect-metadata";
import { Arg, AuthenticationError, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLContext } from "../../context";
import { OtpRegisteration, User, UserWithToken } from "./auth.types";
import { CompleteRegisterationInput, LoginCredentials, VerifyEmailInput } from "./auth.inputs";
import { DomainError } from "../errors";
import { GraphQLError } from "graphql";


@Resolver()
export class AuthResolver {

    @Query(() => User)
    async me(@Ctx() ctx: GraphQLContext): Promise<User> {
        console.log(`User from resolver called`, ctx.user.id)
        const user = await ctx.services.authService.getMe(ctx.user.id)
        return user;
    }



    @Mutation(() => Boolean)
    async verifyEmail(
        @Arg('data', () => VerifyEmailInput) data: VerifyEmailInput,
        @Ctx() ctx: GraphQLContext
    ) {
        return ctx.services.authService.verifyEmail(data);
    }

    @Mutation(() => UserWithToken)
    async login(
        @Arg('credentials', () => LoginCredentials) credentials: LoginCredentials,
        @Ctx() ctx: GraphQLContext): Promise<UserWithToken> {


        return ctx.services.authService.login(credentials);
    }

    @Mutation(() => OtpRegisteration)
    async requestRegisterationOtp(
        @Arg('email', () => String) email: string,
        @Ctx() ctx: GraphQLContext) {
        return ctx.services.authService.requestRegisterationOtp(email)
    }

    @Mutation(() => UserWithToken)
    async completeRegisteration(
        @Arg('data', () => CompleteRegisterationInput) data: CompleteRegisterationInput,
        @Ctx() ctx: GraphQLContext
    ) {
        return ctx.services.authService.completeRegisteration(data);

    }
}