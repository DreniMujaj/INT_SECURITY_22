import Environment from '../../env';
import {GenerateToken} from '../../auth/generateToken';
import {HttpStatusCode} from '../../util/httpStatusCode';
import Logger from '../../logging/logger';
import {Role} from '../../auth/@types/roles';
import Server from '../../server';
import User from './user.model';
import {randomUUID} from 'crypto';
import request from 'supertest';

let token: string;
let userAdminToken: string;
let organization: any;

describe('User Controller', () => {
  beforeAll(async () => {
    Logger.silent = true;
    await Server.getInstance().start();
  });

  it('get the user endpoint', async () => {
    const res = await request(Server.getInstance().getApp()).get(`/${Environment.SERVER_API_HOME()}/user`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.OK);
  });


  afterAll(async () => {
    await User.collection.drop();
    await Server.getInstance().stop();
    Logger.silent = false;
  });
});
