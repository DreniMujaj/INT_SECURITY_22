import User, {IUser} from '../user/user.model';

import Environment from '../../env';
import {HttpStatusCode} from '../../util/httpStatusCode';
import Logger from '../../logging/logger';
import {Role} from '../../auth/@types/roles';
import Server from '../../server';
import {UserOrigin} from '../../auth/@types/origin';
import request from 'supertest';

let user: IUser;

describe('Auth Controller', () => {
  beforeAll(async () => {
    Logger.silent = true;
    await Server.getInstance().start();
    user = {
      origin: UserOrigin.local,
      email: 'john.doe@example.com',
      password: 'Pa$$w0rd',
      roles: [Role.ADMIN],
      active: true,
      confirmed: true,
    };
    await User.create(user);
  });

  it('login successful', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/login`).send({
      localUser: {
        email: user.email,
        password: user.password,
      }});
    expect(res.status).toBe(HttpStatusCode.OK);
  });

  it('wrong password', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/login`).send({
      localUser: {
        email: user.email,
        password: 'Lorem Ipsum',
      }});
    expect(res.status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it('wrong user', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/login`).send({
      localUser: {
        email: 'test@example.com',
        password: user.password,
      }});
    expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
  });

  it('empty password', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/login`).send({
      localUser: {
        email: user.email,
        password: '',
      }});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('empty email', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/login`).send({
      localUser: {
        email: '',
        password: 'Lorem Ipsum',
      }});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('empty email and empty password', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/login`).send({
      localUser: {
        email: '',
        password: '',
      }});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it('empty string email and empty string password', async () => {
    const res = await request(Server.getInstance().getApp()).post(`/${Environment.SERVER_API_HOME()}/login`).send({
      localUser: {
        email: ' ',
        password: ' ',
      }});
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  afterAll(async () => {
    await User.collection.drop();
    await Server.getInstance().stop();
    Logger.silent = false;
  });
});
