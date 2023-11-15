export interface PokemonListResponseEntity {
  id: number;
  name: string;
  url: string;
  sprites: PokemonImgEntity;
  weight: number
  types: PokemonTypeEntity[];
}

export interface PokemonTypeEntity {
  slot: number;
  type: object;
}

export interface PokemonImgEntity {
  back_default: string;
}
