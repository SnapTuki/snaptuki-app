import { PrismaClient } from "@prisma/client";
import { CompleteRegisterationInput, LoginCredentials, VerifyEmailInput } from "./auth.inputs";
import { OtpRegisteration, User, UserWithToken } from "./auth.types";
import * as otpGenerator from 'otp-generator';
import { Redis } from 'ioredis';
import bcrypt from 'bcrypt';
import { InvalidCredentialsError, OtpCodeError, OtpCodeInvalid } from "../errors";
import jwt from 'jsonwebtoken';
import { config } from "../../config";
import { AuthenticationError } from "type-graphql";
import { EmailService } from "../email/email.service";

export class AuthService {

    private dbClient: PrismaClient;
    private redisClient: Redis;
    private emailService: EmailService;

    constructor(dbClient: PrismaClient, redisClient: Redis, email: EmailService) {
        this.dbClient = dbClient;
        this.redisClient = redisClient;
        this.emailService = email;
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


        // step 4 - Send the email
        this.emailService.sendVerificationEmail(email, otpCode);

        // step5 - return result as a promise

        return {
            success: true,
            email: email,
            otpCode: otpCode,
            msg: `OK`
        }

    }

    public async verifyEmail(data: VerifyEmailInput) {
        console.log("Verify email")

        const otpHash = await this.redisClient.get(`otp:${data.email}`);
        if (!otpHash) throw new OtpCodeError("Code has not been found or expired");

        const isOtpValid = bcrypt.compare(data.otpCode, otpHash);
        if (!isOtpValid) throw new OtpCodeInvalid("Verification Code is Invalid");

        // Code used! remove it.
        await this.redisClient.del(`otp:${data.email}`)
        return true;

    }

    public async completeRegisteration(data: CompleteRegisterationInput): Promise<UserWithToken> {
        console.log("Compelete registeration logic")

        // step2 - User creation
        const passwordHash = await bcrypt.hash(data.password, 12);


        const newUser = await this.dbClient.user.create({
            data: {
                role: data.role,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                passwordHash: passwordHash,
            }
        });

        console.log("Account Created!")
        //generate token
        const token = this.generateToken(newUser);
        const createdUser: UserWithToken = {
            user: {
                id: newUser.userId,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
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
        const isPassValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPassValid) throw new InvalidCredentialsError("Password is not correct");


        const typedUser: User = {
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
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

    public async getMe(userId: number): Promise<User> {
        const me = this.dbClient.user.findUnique({
            where: { userId: userId},
            select: {
                userId: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });

        if (!me) throw new AuthenticationError("User Not Found");

        return me;
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

