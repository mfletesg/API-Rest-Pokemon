import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Favorite, FavoriteRelations} from './favorite.model';
import {User, UserRelations} from './user.model';

@model()
export class UserFavorite extends Entity {
  @property({
    type: 'string',
    required: true,
    id: true,
  })
  user_id: string;

  @property({
    type: 'string',
    required: true,
    id: true,
  })
  favorite_id: string;

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

  @belongsTo(() => User, {keyFrom: 'user_id'})
  userId: string;

  @belongsTo(() => Favorite, {keyFrom: 'favorite_id'})
  favoriteId: string;

  constructor(data?: Partial<UserFavorite>) {
    super(data);
  }
}

export interface UserFavoriteRelations {
  user?: UserRelations;
  favorite?: FavoriteRelations;
}

export type UserFavoriteWithRelations = UserFavorite & UserFavoriteRelations;
