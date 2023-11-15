import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {encriptPassword} from '../utils/functions';

export class UsersController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @authenticate('jwt')
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      description: 'Create User',
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['user_id', 'status', 'created_at', 'updated_at'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    const email = await this.userRepository.findByEmail(user.email);
    if (email !== null) {
      throw {
        statusCode: 409,
        name: 'ConflictError',
        message: 'Resource already exists with the same email',
      };
    }
    const password = await encriptPassword(user.password);
    user.password = password;
    return this.userRepository.create(user);
  }

  @authenticate('jwt')
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User),
        },
        example: {
          user_id: '7d39273d-bfe9-4601-a5a6-7b6e72f24971',
          email: 'user@email.com',
          firstName: 'Juan',
          lastName: 'Garcia',
          password: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          status: true,
          created_at: '2023-11-15T14:12:02.369Z',
          updated_at: '2023-11-15T14:12:02.369Z'
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @authenticate('jwt')
  @get('/users/{userId}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('userId') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/users/{userId}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('userId') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
          exclude: ['user_id', 'email', 'created_at', 'updated_at', 'status'],
          example: {
            firstName: 'Juan',
            lastName: 'Garcia',
            password: 'test',
          },
        },
      },
    })
    user: User,
  ): Promise<void> {
    console.log(user.email)
    const userEmail = await this.userRepository.findByEmail(user.email);
    console.log(userEmail)
    console.log(id)


    if (user.email !== undefined && user.email !== null) {
      if (userEmail?.user_id != null && userEmail?.user_id != id) {
        throw {
          statusCode: 403,
          name: 'ForbiddenError',
          message: `Action not allowed, the email ${user.email} is already in use in the system11`,
        };
      }
    }


    if (user.status !== undefined) {
      throw {
        statusCode: 403,
        name: 'ForbiddenError',
        message: 'Action not allowed, direct modification of status is prohibited',
      };
    }

    const password = await encriptPassword(user.password);
    user.password = password;
    await this.userRepository.updateById(id, user)

  }


  @authenticate('jwt')
  @del('/users/{userId}')
  @response(204, {
    description: 'User DELETE success',
  })

  async deleteById(
    @param.path.string('userId') id: string,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) userProfile: UserProfile
  ): Promise<void> {
    if (userProfile.id === id) {
      throw {
        statusCode: 409,
        name: 'ConflictError',
        message: 'You cannot delete your own user.',
      };
    }
    await this.userRepository.deleteById(id);
  }





  @patch('/users/{user_id}/status')
  @response(204, {
    description: 'Active or Disable User by Id',
  })
  async statusUser(
    @param.path.string('user_id') id: string,
    @requestBody({
      description: 'Active o Disable User',
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'StatusUser',
            exclude: ['user_id', 'firstName', 'lastName', 'email', 'created_at', 'updated_at', 'password'],
          }),
        },
      },
    })
    partialUser: Partial<User>,
  ): Promise<void> {
    const partialUpdate: Partial<User> = {
      status: partialUser.status,
    };
    await this.userRepository.updateById(id, partialUpdate)

  }

}
