import Koa from 'koa';
import cors from '@koa/cors';
import body from 'koa-body';
import compose from 'koa-compose';

import * as url from 'url';

import configArgs from '@/lib/args';
import logger from '@/lib/logger';
import db from '@/lib/db';
import { picker, viewMongo } from '@/helpers/objectTransformers';

import router from '@/routes';

const app = new Koa();

if (process.env.NODE_ENV == 'production') {
  app.env = 'production';
}
if (process.env.NODE_ENV == 'test') {
  global.testing = true;
  app.env = process.env.NODE_ENV = 'development';
}

configArgs();

global.env = app.env;
const dev = (process.env.NODE_ENV || global.dev) != 'production';

if (!global.testing) {
  app.use(logger());
}
app.use(cors()); //TODO set origin
app.use(body());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch(e) {
    ctx.status = e.statusCode || e.status || 500;
    ctx.body = { message: e.message, error: e.error, errorPlace: e.errorPlace };
    console.log('[!] error', ctx.body);
    if (dev) {
      console.log(e);
    }
  }
});

app.use(async (ctx, next) => {
  await db();
  await next();
});

app.use(compose([viewMongo(), picker()]));

app.use(router());

if (process.pkg || import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.pkg || process.argv[1] === modulePath) {
    const port = parseInt(process.env.PORT) || 3000;
    app.listen(port, () => {
      console.log(`[*] listening on ${port}, mode: ${app.env}`);
    });
  }
}

export default app;
