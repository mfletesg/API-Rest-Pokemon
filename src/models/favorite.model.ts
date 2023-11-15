import {Entity, belongsTo, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {User, UserWithRelations} from './user.model';

@model()
export class Favorite extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    useDefaultIdType: false,
    default: () => uuid(),
    example: '1s79273s-bfe9-1206-a5a6-9b6e22f27952'
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


  // @belongsTo(() => User, {keyFrom: 'user_id', keyTo: 'user_id', name: 'user_id', })
  // user_id: User;

  // @belongsTo(() => User, {keyFrom: 'user_id', name: 'user'})
  // user_id: string;

  // @belongsTo(() => User, {keyFrom: 'userId', name: 'user'})
  // userId: string;


  @belongsTo(() => User, {keyTo: 'user_id', name: 'user'})
  user_id: string;


  // // Agrega esta propiedad para almacenar el ID del usuario
  // @property({
  //   type: 'string',
  //   required: false,
  // })
  // user_id: string;

  constructor(data?: Partial<Favorite>) {
    super(data);
  }
}

export interface FavoriteRelations {
  user?: UserWithRelations;
}

export type FavoriteWithRelations = Favorite & FavoriteRelations;
