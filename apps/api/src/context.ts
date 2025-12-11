import { UserService } from "./domains/users/user.service.js"
import { User } from "./domains/users/user.types.js"

export interface GraphQLContext {
    services: {
        userService: UserService,
    },
    user: User | null
}

