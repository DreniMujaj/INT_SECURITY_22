import {connect, connection} from 'mongoose';

import Environment from '../env';
import Logger from '../logging/logger';

/**
 * Database Class
 */
export default class Database {
  static instance: Database;

  /**
   * Create Database Connection
   */
  private constructor() {
    this.connect();
  }

  /**
    /**
   * Connect to Database
   */
  public async connect(): Promise<void> {
    if (Environment.NODE_ENV() === 'production') {
      await connect(Environment.MONGODB_URL(), {
        ssl: true,
        sslValidate: false,
        sslCA: Environment.DB_CERTIFICATE(),
        replicaSet: 'rs0',
        retryWrites: false,
        readPreference: 'secondaryPreferred',
      });
    } else {
      await connect(Environment.MONGODB_URL());
      connection.on('error', (err) => {
        Logger.error(err.stack);
      });
    }
  }

  /**
   * Disconnect from Database
   */
  public async disconnect(): Promise<void> {
    await connection.close();
  }

  /**
   * Get Singleton Database
   *
   * @returns {Database} Singleton Database representation
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
