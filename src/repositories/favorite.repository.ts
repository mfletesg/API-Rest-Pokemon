import {inject} from '@loopback/core';
import {DefaultCrudRepository, Where} from '@loopback/repository';
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

  async findByUserId(userId: string): Promise<Favorite[]> {
    const favorites = await this.find({
      where: {user_id: userId},
    });
    return favorites;
  }


  async deleteByUserIdAndPokemonId(userId: string, pokemonId: number): Promise<void> {
    const where: Where<Favorite> = {
      and: [
        {user_id: userId},
        {pokemon_id: pokemonId},
      ],
    };

    await this.deleteAll(where);
  }


  async findByPokemonId(pokemonId: number, userId: string): Promise<Favorite | null> {
    const favorite = await this.findOne({
      where: {
        pokemon_id: pokemonId,
        user_id: userId,
      },
    });
    return favorite ?? null;
  }

}
