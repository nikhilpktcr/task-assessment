
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetCustomer = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const graphqlContext = GqlExecutionContext.create(ctx);
    const context = graphqlContext.getContext();
    const customer = context.req.user; // Assuming customer(user) data is stored in the request object
    if (data) {
      return customer[data]; 
    }
    return customer;
  },
);