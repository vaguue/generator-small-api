import path from 'path';
import Router from '@koa/router';
import * as Models from '@/models';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);

const prefix = `/${path.parse(__filename).name}`;
const router = new Router({ prefix  });

router
  .get('/:name', async ctx => {
    const { name } = ctx.params;
    ctx.body = {
      message: 'ok',
      data: `Hello, ${name}!`,
    };
  });

export default router;
