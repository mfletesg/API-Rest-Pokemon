// Uncomment these imports to begin using these cool features!

import {TokenService, authenticate} from '@loopback/authentication';
import {Credentials, TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {UserRepository} from '../repositories';
import {encriptPassword} from '../utils/functions';
// import {inject} from '@loopback/core';

@authenticate.skip()
export class AuthController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/login')
  async login(@requestBody() credentials: Credentials): Promise<{token: string}> {

    const user = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });

    if (user) {
      console.log(credentials.password)
      console.log(await encriptPassword(credentials.password))
    }
    const password = await encriptPassword(credentials.password)

    if (!user || user.password !== password) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    // Convertir el objeto User a UserProfile
    const userProfile: UserProfile = {
      [securityId]: user.user_id,
      email: user.email,
      // otras propiedades del perfil según sea necesario
    };

    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }
}
