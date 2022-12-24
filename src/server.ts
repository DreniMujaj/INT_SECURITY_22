import express, {Express} from 'express';

import Database from './database/database';
import Environment from './env';
import ErrorHandler from './error/errorHandler';
import FileController from './api/fileUpload/fileUpload.controller';
import {HeaderValidation} from './validating/headerValidation';
import HealthController from './api/health/health.controller';
import Logger from './logging/logger';
import bodyParser from 'body-parser';
import cors from 'cors';
import {createServer} from 'http';
import helmet from 'helmet';
import morganMiddleware from './logging/morgan';

/**
 * Class representing the Server
 */
export default class Server {
  private static instance: Server;
  private http;
  private app: Express;
  private port: number;
  private apiHome: string;
  private database: Database;

  /**
   * Create a new Server
   */
  private constructor() {
    this.port = Environment.PORT() || parseInt('3000');
    this.apiHome = `${Environment.SERVER_API_HOME()}`;
    this.app = express();
    this.app.use(helmet());
    this.app.use(cors());

    this.database = Database.getInstance();

    this.initializePreRouteMiddlewares();
    this.initializeControllers();
    this.initializePostRouteMiddlewares();

    this.http = createServer(this.app);
  }

  /**
   * initializePreRouteMiddlewares
   */
  private initializePreRouteMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(morganMiddleware);
    this.app.use(HeaderValidation.contentTypeCheckMiddleware);
  }

  /**
   * initializeControllers
   */
  private initializeControllers(): void {
    this.app.use(`/`, new HealthController('/health').router);
    this.app.use(`/${this.apiHome}`, new FileController('/file').router);
  }

  /**
   * initializePostRouteMiddlewares
   */
  private initializePostRouteMiddlewares(): void {
    this.app.use(ErrorHandler.errorMiddleware);
  }

  /**
   * Start Server
   */
  public async start(): Promise<void> {
    this.http.listen(this.port, () => {
      Logger.info(`Running on ${this.port} ⚡`);
      Promise.resolve();
    });
  }

  /**
   * Stop Server
   */
  public async stop(): Promise<void> {
    await this.database.disconnect();
    this.http.close(() => Promise.resolve());
  }

  /**
   * App Getter
   *
   * @returns {Express} app
   */
  public getApp(): Express {
    return this.app;
  }

  /**
   * Database Getter
   *
   * @returns {Database} app
   */
  public getDatabase(): Database {
    return this.database;
  }

  /**
   * Get Singleton Server
   *
   * @returns {Server} Singleton Server representation
   */
  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }
}
