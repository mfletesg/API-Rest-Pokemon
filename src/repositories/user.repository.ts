import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.user_id,
  UserRelations
> {

  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource,
  ) {
    super(User, dataSource);
  }


  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.findOne({where: {email}});
      return user || null;
    } catch (error) {
      console.error('Error al buscar usuario por email', error);
      throw new Error('Error al buscar usuario por email');
    }
  }
}
