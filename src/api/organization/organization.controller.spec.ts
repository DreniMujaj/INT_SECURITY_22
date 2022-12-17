import Environment from '../../env';
import {HttpStatusCode} from '../../util/httpStatusCode';
import Logger from '../../logging/logger';
import Organization from '../organization/organization.model';
import {Role} from '../../auth/@types/roles';
import Server from '../../server';
import User from '../user/user.model';
import {createMockUser} from '../../../test/util/mockObjects';
import {mockLogin} from '../../../test/util/mockLogin';
import {randomUUID} from 'crypto';
import request from 'supertest';

let token: string;

describe('Organization Controller', () => {
  beforeAll(async () => {
    Logger.silent = true;
    await Server.getInstance().start();
    token = await mockLogin([Role.superAdmin]);
  });

  it('get all organizations', async () => {
    await Organization.collection.drop();
    await Organization.create({name: randomUUID()});
    await Organization.create({name: randomUUID()});
    const res = await request(Server.getInstance().getApp()).get(`/${Environment.SERVER_API_HOME()}/organization`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body.length).toBe(2);
  });

  it('invalid roles to get organizations', async () => {
    const t = await mockLogin([Role.formAdmin]);
    const res = await request(Server.getInstance().getApp()).get(`/${Environment.SERVER_API_HOME()}/organization`)
        .set({Authorization: `Bearer ${t}`});
    expect(res.status).toBe(HttpStatusCode.FORBIDDEN);
  });

  it('get organization by Id', async () => {
    const org = await Organization.create({name: randomUUID()});
    const res = await request(Server.getInstance().getApp()).get(`/${Environment.SERVER_API_HOME()}/organization/${org.id}`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.OK);
  });

  it('get organization by invalid Id', async () => {
    const res = await request(Server.getInstance().getApp()).get(`/${Environment.SERVER_API_HOME()}/organization/some-random-id`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('get organization by not existing Id', async () => {
    const res = await request(Server.getInstance().getApp()).get(`/${Environment.SERVER_API_HOME()}/organization/63777e082a5a4b91f4077300`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
  });

  it('create organization', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/organization`)
        .send({
          name: `${randomUUID()}`,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.CREATED);
  });
  it('create organization with same name', async () => {
    const name = randomUUID();
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/organization`)
        .send({
          name: name,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.CREATED);
    const res2 = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/organization`)
        .send({
          name: name,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res2.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('create organization empty string param', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/organization`)
        .send({
          name: ` `,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('create organization missing parameters', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/organization`)
        .send({})
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('update organization', async () => {
    const org = await Organization.create({name: randomUUID()});
    const name = randomUUID();
    const res = await request(Server.getInstance().getApp()).put(`/${Environment.SERVER_API_HOME()}/organization/${org.id}`)
        .send({
          name,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.OK);
    expect(res.body.name).toBe(name);
  });

  it('update organization name to an existing organization name', async () => {
    const org = await Organization.create({name: randomUUID()});
    const org2 = await Organization.create({name: randomUUID()});
    const res = await request(Server.getInstance().getApp()).put(`/${Environment.SERVER_API_HOME()}/organization/${org.id}`)
        .send({
          name: org2.name,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('update organization by invalid id', async () => {
    const name = randomUUID();
    const res = await request(Server.getInstance().getApp()).put(`/${Environment.SERVER_API_HOME()}/organization/63777e082a5a4b91f4077300`)
        .send({
          name,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
  });

  it('update organization not existing id', async () => {
    const name = randomUUID();
    const res = await request(Server.getInstance().getApp()).put(`/${Environment.SERVER_API_HOME()}/organization/some-random-id`)
        .send({
          name,
        })
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('update organization empty body', async () => {
    const org = await Organization.create({name: randomUUID()});
    const res = await request(Server.getInstance().getApp()).put(`/${Environment.SERVER_API_HOME()}/organization/${org.id}`)
        .send({})
        .set({Authorization: `Bearer ${token}`});
    expect(res.body.name).toEqual(org.name);
  });

  it('delete organization', async () => {
    const org = await Organization.create({name: randomUUID()});
    const res = await request(Server.getInstance().getApp()).delete(`/${Environment.SERVER_API_HOME()}/organization/${org.id}`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.NO_CONTENT);
  });

  it('delete organization invalid id', async () => {
    const res = await request(Server.getInstance().getApp()).delete(`/${Environment.SERVER_API_HOME()}/organization/some-random-id`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('delete organization not existing id', async () => {
    const res = await request(Server.getInstance().getApp()).delete(`/${Environment.SERVER_API_HOME()}/organization/63777e082a5a4b91f4077300`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
  });

  it('delete organization in use', async () => {
    const org = await Organization.create({name: randomUUID()});
    await createMockUser(undefined, undefined, org.id);
    const res = await request(Server.getInstance().getApp()).delete(`/${Environment.SERVER_API_HOME()}/organization/${org.id}`)
        .set({Authorization: `Bearer ${token}`});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  afterAll(async () => {
    await User.collection.drop();
    await Organization.collection.drop();
    await Server.getInstance().stop();
    Logger.silent = false;
  });
});
