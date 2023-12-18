import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(config: ConfigService, private prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        }) 
    }
    async validate(payload:{ id: number, email: string, role: string}){
        const customer = await this.prisma.customer.findUnique({where:{email: payload.email}});
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        delete customer.password;
        return customer;
    }
}