import "reflect-metadata";
import { Arg, AuthenticationError, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLContext } from "../../context";
import { OtpRegisteration, User, UserWithToken } from "./user.types";
import { LoginCredentials } from "./user.inputs";
import { DomainError } from "../errors";
import { GraphQLError } from "graphql";


@Resolver()
export class UserResolver {

    @Query(() => User, {nullable: true})
    me(@Ctx() {user} : GraphQLContext): User | null{
        if(!user) throw new AuthenticationError('User not found');
        return user;
    }

    @Mutation(() => UserWithToken)
    async login(
        @Arg('credentials', () => LoginCredentials) credentials: LoginCredentials,
        @Ctx() ctx: GraphQLContext): Promise<UserWithToken> {

        try {
            return ctx.services.userService.login(credentials);

        } catch (error) {
            if (error instanceof DomainError) {
                throw new GraphQLError(error.message, { extensions: { code: error.code } })
            }

            // This captures everything else (DB connection fail, coding bug, etc.).
            console.error('CRITICAL UNHANDLED SERVER ERROR:', error);
            throw new GraphQLError(
                'An unexpected internal server error occurred.',
                {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                }
            );
        }
    }

    @Mutation(() => OtpRegisteration)
    async requestRegisterationOtp(
        @Arg('email', ()=>String) email: string,
        @Ctx() ctx: GraphQLContext) {
        return ctx.services.userService.requestRegisterationOtp(email)
    }
}