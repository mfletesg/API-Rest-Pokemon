
import {get} from '@loopback/rest';

export class PokemonController {
  constructor() { }

  // @authenticate('jwt') // Agrega este decorador para habilitar la autenticación JWT
  @get('hello')
  hello(): string {
    // hello(@inject(SecurityBindings.USER) userProfile: UserProfile): string {
    return `Hello Wold w `
  }
}
