import dotenv from 'dotenv';

/**
 * Define environment variables
 */
declare global {
    // eslint-disable-next-line no-unused-vars
    namespace NodeJS {
        export interface ProcessEnv {
            NODE_ENV?: 'development' | 'test' | 'staging' | 'production';
            PORT?: string;
            SERVER_API_HOME?: string;
            SERVER_SESSION_SECRET?: string;
            MONGODB_URL?: string;
            AUTH_ISSUER?: string;
            AUTH_AUDIENCE?: string;
            AUTH_SECRET?: string;
        }
    }
}

/**
 * Environment
 */
export default class Environment {
  private static instance: Environment;

  /**
   * Environment
   */
  private constructor() {
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'production';
    }

    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
      dotenv.config({path: `.env.${process.env.NODE_ENV}`});
    } else {
      dotenv.config();
    }
  }

  /**
   * NODE_ENV
   *
   * @returns NODE_ENV
   */
  public static NODE_ENV(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    return process.env.NODE_ENV!;
  }

  /**
   * PORT
   *
   * @returns PORT
   */
  public static PORT(): number {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.PORT) {
      return parseInt(process.env.PORT);
    } else {
      throw new Error('Environment PORT is not defined');
    }
  }

  /**
   * SERVER_API_HOME
   *
   * @returns SERVER_API_HOME
   */
  public static SERVER_API_HOME(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.SERVER_API_HOME) {
      return process.env.SERVER_API_HOME;
    } else {
      throw new Error('Environment SERVER_API_HOME is not defined');
    }
  }

  /**
   * SERVER_SESSION_SECRET
   *
   * @returns SERVER_SESSION_SECRET
   */
  public static SERVER_SESSION_SECRET(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.SERVER_SESSION_SECRET) {
      return process.env.SERVER_SESSION_SECRET;
    } else {
      throw new Error('Environment SERVER_SESSION_SECRET is not defined');
    }
  }

  /**
   * MONGODB_URL
   *
   * @returns MONGODB_URL
   */
  public static MONGODB_URL(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.MONGODB_URL) {
      return process.env.MONGODB_URL;
    } else {
      throw new Error('Environment MONGODB_URL is not defined');
    }
  }

  /**
   * DB_CERTIFICATE
   *
   * @returns DB_CERTIFICATE
   */
  public static DB_CERTIFICATE(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.DB_CERTIFICATE) {
      return process.env.DB_CERTIFICATE;
    } else {
      throw new Error('Environment DB_CERTIFICATE is not defined');
    }
  }

  /**
   * AUTH_ISSUER
   *
   * @returns AUTH_ISSUER
   */
  public static AUTH_ISSUER(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.AUTH_ISSUER) {
      return process.env.AUTH_ISSUER;
    } else {
      throw new Error('Environment AUTH_ISSUER is not defined');
    }
  }

  /**
   * AUTH_AUDIENCE
   *
   * @returns AUTH_AUDIENCE
   */
  public static AUTH_AUDIENCE(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.AUTH_AUDIENCE) {
      return process.env.AUTH_AUDIENCE;
    } else {
      throw new Error('Environment AUTH_AUDIENCE is not defined');
    }
  }

  /**
   * AUTH_SECRET
   *
   * @returns AUTH_SECRET
   */
  public static AUTH_SECRET(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.AUTH_SECRET) {
      return process.env.AUTH_SECRET;
    } else {
      throw new Error('Environment AUTH_SECRET is not defined');
    }
  }

  /**
   * AUTH_TOKEN_EXP
   *
   * @returns AUTH_TOKEN_EXP
   */
  public static AUTH_TOKEN_EXP(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.AUTH_TOKEN_EXP) {
      return process.env.AUTH_TOKEN_EXP;
    } else {
      throw new Error('Environment AUTH_TOKEN_EXP is not defined');
    }
  }
}
