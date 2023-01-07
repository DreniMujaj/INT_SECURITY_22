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
  /**
   * MAX_UPLOAD_FILESIZE
   *
   * @returns MAX_UPLOAD_FILESIZE
   */
  public static MAX_UPLOAD_FILESIZE(): number {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.MAX_UPLOAD_FILESIZE) {
      return Number(process.env.MAX_UPLOAD_FILESIZE);
    } else {
      throw new Error('Environment MAX_UPLOAD_FILESIZE is not defined');
    }
  }

  /**
   * TEMP_FOLDER
   *
   * @returns TEMP_FOLDER
   */
  public static TEMP_FOLDER(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.TEMP_FOLDER) {
      return process.env.TEMP_FOLDER;
    } else {
      throw new Error('Environment TEMP_FOLDER is not defined');
    }
  }
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
   * FTP PORT
   *
   * @returns FTP PORT
   */
  public static FTP_PORT(): number {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.FTP_PORT) {
      return parseInt(process.env.FTP_PORT);
    } else {
      throw new Error('Environment FTP_PORT is not defined');
    }
  }
  /**
   * FTP_USER
   *
   * @returns FTP_USER
   */
  public static FTP_USER(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.FTP_USER) {
      return process.env.FTP_USER;
    } else {
      throw new Error('Environment FTP_USER is not defined');
    }
  }

  /**
   * IP_ADDRESS
   *
   * @returns IP_ADDRESS
   */
  public static IP_ADDRESS(): string {
    if (!this.instance) {
      this.instance = new Environment();
    }
    if (process.env.IP_ADDRESS) {
      return process.env.IP_ADDRESS;
    } else {
      throw new Error('Environment IP_ADDRESS is not defined');
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
