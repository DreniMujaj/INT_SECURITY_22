import Environment from '../../env';
import {HttpStatusCode} from '../../util/httpStatusCode';
import Logger from '../../logging/logger';
import Organization from '../organization/organization.model';
import {Role} from '../../auth/@types/roles';
import Server from '../../server';
import User from '../user/user.model';
import {mockLogin} from '../../../test/util/mockLogin';
import {randomUUID} from 'crypto';
import request from 'supertest';

let token: string;

describe('Organization Controller', () => {
  beforeAll(async () => {
    Logger.silent = true;
    await Server.getInstance().start();
    token = await mockLogin([Role.ADMIN]);
  });

  it('get the organization endpoint', async () => {
    const res = await request(Server.getInstance().getApp()).get(`/${Environment.SERVER_API_HOME()}/organization`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.OK);
  });

  afterAll(async () => {
    await User.collection.drop();
    await Organization.collection.drop();
    await Server.getInstance().stop();
    Logger.silent = false;
  });
});
