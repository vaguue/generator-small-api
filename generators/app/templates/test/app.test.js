import _ from 'lodash';
import { faker } from '@faker-js/faker';

import request from 'supertest';
import app from '../app';

import db from '@/lib/db';

test('404 works', async () => {
  const response = await request(app.callback()).get('/404');
  expect(response.status).toBe(404);
  expect(response.text).toBe('Not Found');
});
