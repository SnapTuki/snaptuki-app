import { UserRepository } from "../interfaces/userRepository";
import { UserNotFound, RoleAlreadyAssigned } from "../../domain/errors/errors";
import { Role } from "../../domain/valueObjects/role.vo";
import { toUserView } from "../dtos/userDTOs";

export class AssignRole {
    constructor(
        private readonly repo: UserRepository,
    ){}

    async execute(input: {userId: string, role: Role}){
        const user = await this.repo.findByUserId(input.userId);
        if(!user) throw new UserNotFound();

        if(user.roles.includes(input.role)) throw new RoleAlreadyAssigned();

        user.assignRole(input.role);

        await this.repo.save(user);

        return {user: toUserView({...user.snapshot()})};
    }
}