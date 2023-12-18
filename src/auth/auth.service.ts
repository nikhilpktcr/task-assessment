import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {SignInInput, SignUpInput, AuthPayload, ActivateInput } from "./dto";
import * as argon from 'argon2';
import * as nodemailer  from 'nodemailer'
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signup(dto: SignUpInput): Promise<AuthPayload> {
        try {
            const hashPassword = await argon.hash(dto.password);
            const activationCode = await this.generateActivationCode();
            const customer = await this.prisma.customer.create({
                data: {
                    user_name: dto.user_name,
                    email: dto.email,
                    password: hashPassword,
                    activation_code:activationCode
                },
            });
            await this.sendActivationEmail(customer.email, Number(customer.activation_code))
            const token = await this.signToken(customer.id, customer.email, customer.role, '30m');
            return {accessToken: token};
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ForbiddenException('Customer already exists');
            } else {
                throw error;
            }
        }
    }

    async signin(dto: SignInInput): Promise<AuthPayload> {
        try {
            const customer = await this.prisma.customer.findUnique({
                where: {
                    email: dto.email,
                },
            });
            if (!customer) {
                throw new ForbiddenException('Incorrect credentials');
            }else if(customer.is_active=== false){
                throw new ForbiddenException('need to be a verified customer, please verify your email')
            }
            const passwordMatch = await argon.verify(customer.password, dto.password);
            if (!passwordMatch) {
                throw new ForbiddenException('Incorrect credentials');
            }
            const token = await this.signToken(customer.id, customer.email, customer.role, '30m');
            const refreshToken = await this.signToken(customer.id, customer.email, customer.role, '7d');
            console.log(refreshToken);
            return { accessToken: token, refreshToken: refreshToken};
        } catch (error) {
            throw error;
        }
    }

    async signToken(userId: string, email: string, role: string, expiryTime): Promise<string> {
        const data = {
            id: userId,
            email: email,
            role: role,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(data, { expiresIn: expiryTime, secret: secret });
        return token;
    }

    async sendActivationEmail(email: string, activationCode: number){
        try {
                // Create a SMTP transporter using Gmail
                let transporter = nodemailer.createTransport({
                    host: 'smtp.freesmtpservers.com',
                    port: 25,
                });

                let message = {
                    from: 'support_auth@mail.com',
                    to: email,
                    subject: 'Activate your account',
                    text: `Your activation code is ${activationCode}. Please use this code to activate your account.`,
                };
                let info = await transporter.sendMail(message);
                console.log('Activation email sent:', info.response);
            } catch (error) {
                console.log(error)
                console.error('Failed to send activation email:', error.toString());
            }
    }
    async generateActivationCode(){
      const activationCode = await Math.floor(100000 + Math.random() * 900000);
      return activationCode.toString();
    }

    async activate (dto: ActivateInput){
        try {
            const customer = await this.prisma.customer.findUnique({
                where: {
                    email: dto.email,
                },
            });
            if (!customer) {
                throw new ForbiddenException('Customer not found');
            }
            if(Number(customer.activation_code) === Number(dto.activation_code)){
                await this.prisma.customer.update({
                    data:{
                        is_active: true
                    },
                    where:{
                        email: dto.email
                    }
                })
                return 'Customer Verified Successfully'
            }else{
                throw new NotAcceptableException('Incorrect Activation Code')
            }
        } catch (error) {
            throw new InternalServerErrorException('Failed to activate customer');
        }
    }

    async refreshToken (refreshToken:string): Promise<AuthPayload>{
        const tokenDetails = await this.verifyToken(refreshToken);
        console.log("decodedToken", tokenDetails)
        const token = await this.signToken(tokenDetails.id, tokenDetails.email, tokenDetails.role, '30m');
        return {accessToken: token}

    }

    async verifyToken(token:string){
        const secret = this.config.get('JWT_SECRET');
        const decodedToken = await this.jwt.verifyAsync(token, {secret:secret});
        return decodedToken;
    }
}
