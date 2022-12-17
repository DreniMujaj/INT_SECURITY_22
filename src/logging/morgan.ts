import morgan, {StreamOptions} from 'morgan';

import Environment from '../env';
import Logger from './logger';
import split from 'split';

const stream: StreamOptions = split().on('data', (line) => Logger.http(line));

/**
 * @returns returns env !== development
 */
const skip = (): boolean => {
  const env = Environment.NODE_ENV();
  return env !== 'development';
};

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {stream, skip},
);

export default morganMiddleware;
