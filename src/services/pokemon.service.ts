import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import axios from 'axios';
import {PokemonListResponseEntity} from '../entity/listPokemonResponse';

@injectable({scope: BindingScope.TRANSIENT})
export class PokemonService {
  constructor(
  ) { }

  async getPokemons(offset: number = 1, limit: number = 20) {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
      );
      return response.data.results;
    } catch (error) {
      throw new HttpErrors.InternalServerError('Error fetching Pokemon data');
    }
  }


  async getDetailPokemonByUrl(url: string): Promise<PokemonListResponseEntity> {
    try {
      const response = await axios.get(
        url,
      );
      const data: PokemonListResponseEntity = response.data
      return data;
    } catch (error) {
      throw new HttpErrors.InternalServerError('Error fetching Detail Pokemon data');
    }
  }
}
