import { PrismaClient } from "@prisma/client"; 
import { CompleteRegisterationInput } from "./user.inputs";
import { OtpRegisteration } from "./user.types";
import * as otpGenerator from 'otp-generator';
import {Redis} from 'ioredis';
import bcrypt from 'bcrypt';


export class UserService {

    private dbClient: PrismaClient;
    private redisClient: Redis;

    constructor(dbClient: PrismaClient, redisClient: Redis) {
        this.dbClient = dbClient;
        this.redisClient = redisClient;
    };

    public async requestRegisterationOtp(email: string): Promise<OtpRegisteration> {

        console.log("Executing otp logic")
        //step1 - Check whether the user is already registered
        const existingUser = await this.dbClient.user.findUnique({where: {email}});
        if(existingUser) return {success: false, email, otpCode: 'None',msg: 'User already existed'}

        //step2 - Generate OTP 6-digits code

        const otpCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        // step3 - save the code in Redis

        const OTP_EXPIRY_SECONDS = 60 * 5;
        const otpHash = await bcrypt.hash(otpCode, 12);

        await this.redisClient.setex(
            `otp:${email}`,
            OTP_EXPIRY_SECONDS,
            otpHash
        );

        // step4 - Send it via email to user
        

        // step5 - return result as a promise

        return {
            success: true,
            email: email,
            otpCode: otpCode,
            msg: `OK`
        }

    }

    public async completeRegisteration(data: CompleteRegisterationInput) {
        console.log("Compelete registeration logic")

        // step1 - 
    }

    private generateToken(): String {
        return ""
    }






}

