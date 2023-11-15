// Uncomment these imports to begin using these cool features!

import {TokenService, authenticate} from '@loopback/authentication';
import {Credentials, TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {ResponseTokenEntity} from '../entity/responseToken';
import {User} from '../models';
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
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private tokenExpiresIn: string,
  ) {


  }

  @post('/login')
  @response(200, {
    description: 'Token de acceso',
    content: {
      'application/json': {
        schema: {},
        example: {
          token: 'your_access_token'
        },
      }
    },
  })
  @response(401, {
    description: 'Credenciales inválidas',
    content: {'application/json': {schema: {}}},
  })
  @response(500, {
    description: 'Error interno del servidor',
    content: {'application/json': {schema: {}}},
  })
  async login(@requestBody({
    description: 'API Login',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          title: 'Login',
          exclude: ['user_id', 'created_at', 'updated_at', 'status', 'firstName', 'lastName']
        }),
        example: {
          email: 'test@whathecode.com',
          password: 'test'
        },
      },
    },
  }) credentials: Credentials): Promise<ResponseTokenEntity> {

    const user = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });

    const password = await encriptPassword(credentials.password)
    if (!user || user.password !== password) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }
    const userProfile: UserProfile = {
      [securityId]: user.user_id,
      email: user.email,
    };

    let response: ResponseTokenEntity = {
      token: '',
      expiresIn: +this.tokenExpiresIn,
      tokenType: 'Bearer',
    };

    response.token = await this.jwtService.generateToken(userProfile);
    return response;
  }
}
