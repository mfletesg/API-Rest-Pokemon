import {Entity, model, property} from '@loopback/repository';

@model()
export class UserFavorite extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  user_id: string;

  @property({
    type: 'string',
    required: true,
  })
  favorite_id: string;

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: string;


  constructor(data?: Partial<UserFavorite>) {
    super(data);
  }
}

export interface UserFavoriteRelations {
  // describe navigational properties here
}

export type UserFavoriteWithRelations = UserFavorite & UserFavoriteRelations;
