import {Entity, hasMany, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {UserFavorite, UserFavoriteRelations} from './user-favorite.model';

@model()
export class Favorite extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    default: () => uuid(),
  })
  favorite_id: string;

  @property({
    type: 'number',
    required: true,
  })
  pokemon_id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  created_at: Date;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: Date;


  @hasMany(() => UserFavorite, {keyTo: 'favorite_id'})
  userFavorites: UserFavorite[];

  constructor(data?: Partial<Favorite>) {
    super(data);
  }
}

export interface FavoriteRelations {
  userFavorites?: UserFavoriteRelations;
}

export type FavoriteWithRelations = Favorite & FavoriteRelations;
