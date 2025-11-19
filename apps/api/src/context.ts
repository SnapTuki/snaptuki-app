import { UserService } from "./domains/users/user.service.js"

export interface GraphQLContext {
    services: {
        userService: UserService,
    },
}

