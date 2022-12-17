import Logger from './logging/logger';
import Server from './server';

Server.getInstance().start();

process.on('unhandledRejection', (error: Error) => {
  throw error;
});

process.on('uncaughtException', (error: Error) => {
  Logger.error(error.stack);
  process.exit(1);
});
