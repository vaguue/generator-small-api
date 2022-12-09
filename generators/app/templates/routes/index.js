import compose from 'koa-compose';

import helloWorld from '@/routes/hello-world';

const router = () => compose([
  helloWorld.routes(),
]);

export default router;
