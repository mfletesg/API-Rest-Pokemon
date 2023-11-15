import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
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
import {User} from '../models';
import {UserRepository} from '../repositories';
import {encriptPassword} from '../utils/functions';

export class UsersController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

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


  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {

    const userEmail = await this.userRepository.findByEmail(user.email);

    if (userEmail?.user_id != null && userEmail?.user_id != id) {
      throw {
        statusCode: 403,
        name: 'ForbiddenError',
        message: `Action not allowed, the email ${user.email} is already in use in the system`,
      };
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



  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }





  @patch('/users/{id}/status')
  @response(204, {
    description: 'Active or Disable User by Id',
  })
  async statusUser(
    @param.path.string('id') id: string,
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
