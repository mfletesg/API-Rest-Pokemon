import {Entity, hasMany, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {UserFavorite, UserFavoriteRelations} from './user-favorite.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    default: () => uuid(),
  })
  user_id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'boolean',
    required: true,
  })
  status: boolean;

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



  @hasMany(() => UserFavorite, {keyTo: 'user_id'})
  userFavorites: UserFavorite[];


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  userFavorites?: UserFavoriteRelations;
}

export type UserWithRelations = User & UserRelations;
