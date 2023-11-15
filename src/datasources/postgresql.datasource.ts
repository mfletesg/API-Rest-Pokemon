import {Context, inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {UserRepository} from '../repositories';
import {encriptPassword} from '../utils/functions';
require('dotenv').config();

const config = {
  name: 'postgresql',
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'HTTP99@0',
  database: process.env.DB_NAME || 'pokemonDB',
};


@lifeCycleObserver('datasource')
export class PostgresqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'postgresql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.postgresql', {optional: true})
    dsConfig: object = config,
    /* Esta línea de código te permite acceder al contexto de la aplicación para
    obtener servicios y objetos relacionados, en este caso, para obtener el UserRepository
    durante el inicio de la aplicación en el método start.
    */
    @inject.context() private ctx: Context,
  ) {
    super(dsConfig);
  }


  // Este método se llamará cuando la aplicación se inicie
  async start() {
    const userRepository: UserRepository = await this.ctx.get('repositories.UserRepository');
    // Lógica para insertar el usuario
    await this.createDatabaseSchema();
    // Lógica para insertar el usuario
    await this.createUser(userRepository);
  }


  async createUser(userRepository: UserRepository) {
    // Verifica si el usuario ya existe
    const existingUser = await userRepository.findOne({
      where: {email: 'test@whathecode.com'},
    });
    // Si el usuario no existe, créalo
    if (!existingUser) {
      try {
        const passwordEncript = await encriptPassword('test')
        await userRepository.create({
          user_id: uuidv4(),
          email: 'test@whathecode.com',
          password: passwordEncript,
          lastName: 'admin',
          firstName: 'test',
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        });
      } catch (error) {
        console.error('Error inserting data ', error);
      }
    }
  }


  async createDatabaseSchema() {
    try {
      // Utiliza autoupdate para crear o actualizar el esquema de la base de datos
      await this.autoupdate();
      console.log('Database schema created or updated.');
    } catch (error) {
      console.error('Error creating or updating the database schema:', error);
    }
  }
}
