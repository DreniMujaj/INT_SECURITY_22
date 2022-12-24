import {HttpStatusCode} from '../../util/httpStatusCode';
import Logger from '../../logging/logger';
import Server from '../../server';
import request from 'supertest';

describe('File Controller', () => {
  beforeAll(async () => {
    Logger.silent = true;
    await Server.getInstance().start();
  });
  it('file route test', async () => {
    const res = await request(Server.getInstance().getApp()).get(`/file`);
    expect(res.status).toBe(HttpStatusCode.OK);
  });
  afterAll(async () => {
    await Server.getInstance().stop();
    Logger.silent = false;
  });
});
