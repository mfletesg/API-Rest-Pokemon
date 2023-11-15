import {Entity, hasMany, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {Favorite, FavoriteWithRelations} from './favorite.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    default: () => uuid(),
    example: '7d39273d-bfe9-4601-a5a6-7b6e72f24971'
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
    required: false,
    default: true,
  })
  status: boolean;

  @property({
    type: 'date',
    required: false,
    defaultFn: 'now',
  })
  created_at: Date;

  @property({
    type: 'date',
    required: false,
    defaultFn: 'now',
  })
  updated_at: Date;

  @hasMany(() => Favorite, {keyTo: 'user_id', name: 'favorites'})
  favorites?: Favorite[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  favorites?: FavoriteWithRelations[];
}

export type UserWithRelations = User & UserRelations;
