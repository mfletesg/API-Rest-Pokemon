import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {v4 as uuidv4} from 'uuid';
import {PokemonListEntity} from '../entity/listPokemon';
import {PokemonImgEntity, PokemonListResponseEntity} from '../entity/listPokemonResponse';
import {Favorite} from '../models';
import {FavoriteRepository, UserRepository} from '../repositories';
import {PokemonService} from '../services';

export class FavoriteController {
  constructor(
    @repository(FavoriteRepository)
    public favoriteRepository: FavoriteRepository,
    @inject('services.PokemonService')
    public pokemonService: PokemonService,
    @repository(UserRepository) protected userRepository: UserRepository,

  ) { }


  @authenticate('jwt')
  @get('/user/{userId}/favorite')
  @response(200, {
    description: 'Gell Favorite model instance by User',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Favorite),
      },
    },
  })
  async getAllFavorites(
    @param.path.string('userId') userId: string,
    @param.filter(Favorite, {exclude: 'where'}) filter?: FilterExcludingWhere<Favorite>,

  ): Promise<any> {
    const favorite = await this.favoriteRepository.findByUserId(userId);
    if (!favorite) {
      throw new HttpErrors.NotFound(`Favorite not found for userId: ${userId}`);
    }
    return favorite;
  }


  @authenticate('jwt')
  @post('/user/{userId}/favorite')
  @response(200, {
    description: 'New Favorite Pokemon model instance',
    content: {'application/json': {schema: getModelSchemaRef(Favorite)}},
  })
  async newPokemon(
    @param.path.string('userId') userId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorite, {
            title: 'NewFavoritePokemon',
            exclude: ['favorite_id', 'created_at', 'created_at', 'updated_at', 'user_id'],
          }),
          example: {
            pokemon_id: 2,
            name: 'ivysaur'
          },
        },
      },
    })
    favorite: Favorite,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) userProfile: UserProfile
  ): Promise<Favorite> {

    //Validamos que solo el usuario pueda añadir sus pokemos
    if (userProfile.id !== userId) {
      throw {
        statusCode: 404,
        name: 'ForbiddenError',
        message: 'It is not allowed to modify or add another Pokémon from another user.',
      };
    }

    const existPokemon = await this.favoriteRepository.findByPokemonId(favorite.pokemon_id, userId)
    console.log(existPokemon)
    if (existPokemon !== null) {
      throw {
        statusCode: 409,
        name: 'ConflictError',
        message: 'The Pokémon already exists in favorites.',
      };
    }
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw {
        statusCode: 404,
        name: 'NotFoundError',
        message: 'userId not found',
      };
    }

    if (favorite.favorite_id) {
      favorite.favorite_id = uuidv4();
    }

    favorite.user_id = userId;
    return this.favoriteRepository.create(favorite);
  }


  @authenticate('jwt')
  @get('/pokemon')
  @response(200, {
    description: 'List Pokemons',
    content: {'application/json': {schema: {}}},
  })
  async getPokemons(
    @param.query.number('offset') offset: number = 1,
    @param.query.number('limit') limit: number = 20,
  ): Promise<any> {
    try {
      let listPokemon: PokemonListEntity[] = [];
      listPokemon = await this.pokemonService.getPokemons(offset, limit);

      if (listPokemon === null) {
        return null;
      }
      let pokemons: PokemonListResponseEntity[] = [];
      for (let [key, value] of Object.entries(listPokemon)) {
        const pokemon = await this.pokemonService.getDetailPokemonByUrl(value.url);

        const sprites: PokemonImgEntity = {
          back_default: pokemon.sprites.back_default
        }
        const mappedPokemon: PokemonListResponseEntity = {
          id: pokemon.id,
          name: pokemon.name,
          url: value.url,
          sprites: sprites,
          weight: pokemon.weight,
          types: pokemon.types.map((type: any) => ({
            slot: type.slot,
            type: type.type,
          })),
        };
        pokemons.push(mappedPokemon);
      }
      return pokemons;
    } catch (error) {
      console.log(error)
    }
  }


  @authenticate('jwt')
  @del('/user/{userId}/pokemon/{pokemonId}')
  @response(204, {
    description: 'Favorite DELETE success',
  })
  async deleteById(
    @param.path.string('userId') userId: string,
    @param.path.number('pokemonId') pokemonId: number
  ): Promise<void> {
    await this.favoriteRepository.deleteByUserIdAndPokemonId(userId, pokemonId);
  }
}
