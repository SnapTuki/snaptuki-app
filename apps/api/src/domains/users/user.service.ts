import { PrismaClient } from "@prisma/client";
import { CompleteRegisterationInput } from "./user.inputs.js";
import { PrismaClient as Prisma } from "../../generated/prisma/index.js";

export class UserService {

    private dbClient: PrismaClient;

    //dependency Injection
    //make db availabe for this class
    constructor(dbClient: PrismaClient){
        this.dbClient = dbClient;
    };

    public async requestRegisterationOtp(email: String){
        console.log("OTP Logic executed")
    }

    public async completeRegisteration(data: CompleteRegisterationInput){
        console.log("Compelete registeration logic")
    }

    
}

