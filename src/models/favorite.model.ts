import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';

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


  constructor(data?: Partial<Favorite>) {
    super(data);
  }
}

export interface FavoriteRelations {
  // describe navigational properties here
}

export type FavoriteWithRelations = Favorite & FavoriteRelations;
