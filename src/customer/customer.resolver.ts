import { Resolver, Query, Args } from '@nestjs/graphql';
import { CustomerOnePayload, CustomerPayload, DeleteCustomerInput, UpdateCustomerInput } from './dto/index'
import { CustomerService } from './customer.service';
import { JwtGuard } from 'src/auth/guard';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { GetCustomer } from 'src/auth/decorator';
import { Customer } from '@prisma/client';

@Resolver()
@UseGuards(JwtGuard)

export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}


  @Query(() => [CustomerPayload])
  async getCustomers(@GetCustomer() customer: Customer): Promise<CustomerPayload[]> {
    if(customer.role !== 'ADMIN'){
      throw new ForbiddenException('Unauthorised access')
    }
    return this.customerService.getCustomers();
  }

  @Query(() => CustomerPayload)
  async getCustomer(@GetCustomer() customer: Customer): Promise<CustomerPayload> {
    const id = customer.id;
    const email = customer.email;
    return this.customerService.getCustomerByIdOrEmail(id || email);
  }


  @Query(() => CustomerOnePayload)
  async updateCustomer(@GetCustomer() customer: Customer, @Args('input') dto: UpdateCustomerInput): Promise<CustomerOnePayload> {
    const id = customer.id;
    const email = customer.email;
    const role = customer.role;
    console.log("update role", role)
    return this.customerService.updateCustomerByIdOrEmail(dto, role,  id || email);
  }


  @Query(() => Boolean)
  async deleteCustomer(@GetCustomer() customer: Customer, @Args('input') dto: DeleteCustomerInput): Promise<Boolean> {
    if(customer.role !== 'ADMIN'){
      throw new ForbiddenException('Unauthorised access')
    }
    return this.customerService.deleteCustomerByIdOrEmail(dto);
  }

}
