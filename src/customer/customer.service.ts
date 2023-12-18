import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerOnePayload, CustomerPayload, DeleteCustomerInput, UpdateCustomerInput } from './dto/index';

@Injectable()
export class CustomerService {
    constructor(private prisma: PrismaService){
    }
    async getCustomers ():Promise<CustomerPayload[]>{
        const customers = await this.prisma.customer.findMany()
        const customerPayloads: CustomerPayload[] = customers.map(customer => ({
            id: customer.id,
            email: customer.email,
            role: customer.role,
        }));
        return customerPayloads
    }

    async getCustomerByIdOrEmail(identifier: string):Promise<CustomerOnePayload>{
        const customer = await this.prisma.customer.findFirst({
            where: {
                OR: [{id: identifier},{email: identifier}]
            },
        });
        if(!customer){
            throw new ForbiddenException('customer not found')
        }else if(customer.is_active=== false){
            throw new ForbiddenException('need to be a verified customer, please verify your email')
        }
        const { password, is_active, activation_code, created_at, updated_at, ...customerDetails} = customer
        return customerDetails;
    }

    async updateCustomerByIdOrEmail(dto: UpdateCustomerInput, role: string, identifier: string):Promise<CustomerOnePayload>{
        let customer;
        if(role === 'ADMIN'){
            customer = await this.prisma.customer.findFirst({
                where: {
                    OR: [{id: dto.customer_id},{email: dto.customer_email}]
                },
            });
        }else{
            customer = await this.prisma.customer.findFirst({
                where: {
                    OR: [{id: identifier},{email: identifier}]
                },
            });
        }
        if(!customer){
            throw new ForbiddenException('customer not found')
        }else if(customer.is_active=== false){
            throw new ForbiddenException('need to be a verified customer, please verify your email')
        }
        let updateData = {};
        if(role==='ADMIN'){
            updateData = {
                user_name: dto.user_name,
                role : dto.role
            }
            customer = await this.prisma.customer.update({
                data:updateData,
                where:{
                    id:customer.id
                }
            })
        }else{
            updateData = {
                user_name: dto.user_name
            }
            customer = await this.prisma.customer.update({
                data:updateData,
                where:{
                    id:customer.id
                }
            })
        }

        const result = {
            id: customer.id,
            role: customer.role,
            user_name: customer.user_name,
            email: customer.email
        }
        return result;
    }

    async deleteCustomerByIdOrEmail(dto: DeleteCustomerInput):Promise<Boolean>{
        try {  
            const customer = await this.prisma.customer.findFirst({
            where: {
                OR: [{id: dto.customer_id},{email: dto.customer_email}]
                },
            });
            if(!customer){
                throw new ForbiddenException('customer not found')
            }else if(customer.is_active=== false){
                throw new ForbiddenException('need to be verified customer, please verify your email')
            }
            await this.prisma.customer.delete({
                where:{
                    id: customer.id
                }
            })
            return true;
            
        } catch (error) {
            console.log(error);
           throw new InternalServerErrorException('Failed to delete customer');
        }
      
    }
}
