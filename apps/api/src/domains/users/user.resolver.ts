import { Ctx, Query, Resolver } from "type-graphql";
import { GraphQLContext } from "../../context.js";

@Resolver()
export class UserResolver {

    @Query(returns => String)
    async getAllUser(@Ctx() ctx: GraphQLContext){
        return ctx.services.userService.requestRegisterationOtp('email')
    }
}