
import {get} from '@loopback/rest'


export class PokemonController {
  constructor() { }


  @get('hello')
  hello(): string {
    return "Hello Wold"
  }
}
