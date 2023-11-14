import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {UserFavorite, UserFavoriteRelations} from '../models';

export class UserFavoriteRepository extends DefaultCrudRepository<
  UserFavorite,
  typeof UserFavorite.prototype.user_id,
  UserFavoriteRelations
> {
  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource,
  ) {
    super(UserFavorite, dataSource);
  }
}
