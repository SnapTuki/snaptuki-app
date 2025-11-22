import "reflect-metadata";
import { Ctx, Query, Resolver } from "type-graphql";
import { GraphQLContext } from "../../context";
import { OtpRegisteration } from "./user.types";
@Resolver()
export class UserResolver {

    @Query(returns => OtpRegisteration)
    async requestRegisterationOtp(@Ctx() ctx: GraphQLContext){
        return ctx.services.userService.requestRegisterationOtp('email')
    }
}