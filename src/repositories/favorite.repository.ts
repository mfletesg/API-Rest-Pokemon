import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Favorite, FavoriteRelations} from '../models';

export class FavoriteRepository extends DefaultCrudRepository<
  Favorite,
  typeof Favorite.prototype.favorite_id,
  FavoriteRelations
> {
  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource,
  ) {
    super(Favorite, dataSource);
  }
}
