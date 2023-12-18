import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true}),
      PrismaModule, 
      AuthModule, 
      CustomerModule,
      GraphQLModule.forRoot({
        autoSchemaFile: join(process.cwd(), '/src/schema.gql'), 
        playground: true, 
        driver: ApolloDriver
      }),
    ],
  controllers: [],
  providers: [AppResolver, PrismaService],
})
export class AppModule {}
