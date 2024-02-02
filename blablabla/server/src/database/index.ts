import * as mongoose from 'mongoose';
import * as promise from 'bluebird';
import Models from './models';
import { config } from '../config';

mongoose.Promise = promise;

interface IDatabaseOptions {
  autoIndex?: boolean;
  poolSize?: number;
  useMongoClient?: boolean;
}

const defaultOptions: IDatabaseOptions = {
  autoIndex: false,
  poolSize: 10,
  useMongoClient: true
};

class Database {
  private options: IDatabaseOptions;
  public db: mongoose.Connection;
  public models: Models;

  constructor(options: IDatabaseOptions) {
    this.options = options;
  }

  public initConnection(options: IDatabaseOptions = {}): Promise<mongoose.Connection> {
    return new Promise((resolve, reject) => {
      mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`, {...this.options, ...options})
        .then(() => {
          // Successfully connected with MongoDB
          this.db = mongoose.connection;
          return resolve(this.db);
        })
        .catch((error) => {
          // Connection with MongoDB failed
          return reject(error);
        });
    });
  }

  public async initDatabase(options: IDatabaseOptions): Promise<void> {
    try {
      const conn = (await this.initConnection(options) as mongoose.Connection);
      // Initiate all the models that will be used through the application
      this.models = new Models(conn);
      
      conn.on('connected', () => {
        console.log('Connected with MongoDB');
      });

      conn.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
      });

      conn.on('connecting', () => {
        console.log('Trying to connect with MongoDB...');
      });

      conn.on('disconnecting', () => {
        console.log('Disconnecting from MongoDB...');
      });
    } catch (error) {
      console.log('Failed connection with MongoDB', error);
    }
  }
}

const database = new Database(defaultOptions);

export default database;
