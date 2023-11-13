import {Entity, model, property} from '@loopback/repository';

@model()
export class Favorite extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
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
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: string;


  constructor(data?: Partial<Favorite>) {
    super(data);
  }
}

export interface FavoriteRelations {
  // describe navigational properties here
}

export type FavoriteWithRelations = Favorite & FavoriteRelations;
