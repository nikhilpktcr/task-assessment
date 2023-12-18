import { InputType,ObjectType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field({ description: 'Email address' })
  user_name: string;

  @Field({ description: 'Email address' })
  email: string;

  @Field({ description: 'Password' })
  password: string;
}

@InputType()
export class SignInInput {
  @Field({ description: 'Email address' })
  email: string;

  @Field({ description: 'Password' })
  password: string;
}

@InputType()
export class ActivateInput {
  @Field({ description: 'Email address' })
  email: string;

  @Field({ description: 'Activation code' })
  activation_code: string;
}




@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string

  @Field()
  refreshToken?: string
}




