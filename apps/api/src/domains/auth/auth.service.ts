import { PrismaClient } from "@prisma/client";
import { CompleteRegisterationInput, LoginCredentials } from "./auth.inputs";
import { OtpRegisteration, User, UserWithToken } from "./auth.types";
import * as otpGenerator from 'otp-generator';
import { Redis } from 'ioredis';
import bcrypt from 'bcrypt';
import { InvalidCredentialsError, OtpCodeError } from "../errors";
import jwt from 'jsonwebtoken';
import { config } from "../../config";
import { AuthenticationError } from "type-graphql";

export class AuthService {

    private dbClient: PrismaClient;
    private redisClient: Redis;

    constructor(dbClient: PrismaClient, redisClient: Redis) {
        this.dbClient = dbClient;
        this.redisClient = redisClient;
    };

    public async requestRegisterationOtp(email: string): Promise<OtpRegisteration> {

        console.log("Executing otp logic")
        //step1 - Check whether the user is already registered
        const existingUser = await this.dbClient.user.findUnique({ where: { email } });
        if (existingUser) return { success: false, email, otpCode: 'None', msg: 'User already existed' }

        //step2 - Generate OTP 6-digits code

        const otpCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        // step3 - save the code in Redis

        const OTP_EXPIRY_SECONDS = 60 * 30; // 30 mins
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

    public async completeRegisteration(data: CompleteRegisterationInput): Promise<UserWithToken> {
        console.log("Compelete registeration logic")

        // step1 - Verification & Validation
        const otpHash = await this.redisClient.get(`otp:${data.email}`);
        if (!otpHash) throw new OtpCodeError("Code has not been found or expired");

        const isOtpValid = bcrypt.compare(data.otpCode, otpHash);
        if (!isOtpValid) throw new OtpCodeError("Invalid Code");

        // step2 - User creation
        const passwordHash = await bcrypt.hash(data.password, 12);


        const newUser = this.dbClient.user.create({
            data: {
                role: data.role,
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                password_hash: passwordHash,
                date_of_birth: new Date(data.birthdate),
            }
        });




        //generate token
        const token = this.generateToken(newUser);
        const createdUser: UserWithToken = {
            user: {
                id: newUser.user_id,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            },
            token: token
        }
        return createdUser;
    };

    public async login(credentials: LoginCredentials): Promise<UserWithToken> {

        //check if user exists
        const user = await this.dbClient.user.findUnique({
            where: {
                email: credentials.email
            }
        });

        console.log(user)

        if (!user) throw new InvalidCredentialsError("Email does not exists");

        // check passowrd
        const isPassValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isPassValid) throw new InvalidCredentialsError("Password is not correct");


        const typedUser: User = {
            id: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role
        }
        const token = this.generateToken(user);

        const authPayload: UserWithToken = {
            user: typedUser,
            token: token
        }
        return authPayload;
    }

    public async getMe(user_id: string): Promise<User>{
        const me = this.dbClient.findUnique({
            where: {user_id}
        });

        if(!me) throw new AuthenticationError("User Not Found");

        return {
            id: me.user_id,
            firstName: me.first_name,
            lastName: me.last_name,
            role: me.role,
            email: me.email
        }
    }

    private generateToken(user: User): string {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        return jwt.sign(payload, config.jwtSecret);
    };

}

