import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from "./strategy/index";

@Module({
  imports:[PrismaModule, JwtModule.register({})],
  providers:[AuthService, AuthResolver, JwtStrategy]
})
export class AuthModule {}
