

import { ObjectType, Field, InputType } from '@nestjs/graphql';




@InputType()
export class UpdateCustomerInput {
    @Field()
    user_name: string

    @Field({ nullable: true }) 
    role?: string

    @Field({ nullable: true }) 
    customer_id?: string
    
    @Field({ nullable: true }) 
    customer_email?: string
}



@InputType()
export class DeleteCustomerInput {
    @Field({ nullable: true }) 
    customer_id?: string
    
    @Field({ nullable: true }) 
    customer_email?: string
}

@ObjectType()
export class CustomerPayload {
    @Field()
    id: string

    @Field()
    email: string

    @Field()
    role: string
}


@ObjectType()
export class CustomerOnePayload {
    @Field()
    id: string

    @Field()
    email: string

    @Field()
    role: string

    @Field()
    user_name: string
}
