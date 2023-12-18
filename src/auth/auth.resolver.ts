import { Resolver, Mutation, Args} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput, AuthPayload, ActivateInput } from './dto';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(()=> AuthPayload)
  async signup(@Args('input') dto : SignUpInput): Promise<AuthPayload> {
    return this.authService.signup(dto);
  }

  @Mutation(()=> AuthPayload ) 
  async signin(@Args('input') dto: SignInInput): Promise<AuthPayload> {
    return this.authService.signin(dto);
  } 

  @Mutation(()=> String) 
  async activate(@Args('input') dto: ActivateInput):Promise<String>{
    return this.authService.activate(dto);
  }

  @Mutation(() => AuthPayload)
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<AuthPayload> {
    return this.authService.refreshToken(refreshToken);
  }
}