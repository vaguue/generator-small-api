import _ from 'lodash';
import viewMongoTransformer from '@/lib/viewMongo';

export const viewMongo = () => (async (ctx, next) => {
  await next();
  if (ctx.body && typeof ctx.body == 'object') {
    ctx.body = viewMongoTransformer(ctx.body);
  }
});

const doPick = (obj, pick) => {
  if (Array.isArray(obj)) {
    return obj.map(e => _.pick(e, pick));
  }
  else if (typeof obj == 'object') {
    return _.pick(obj, pick);
  }
  else {
    return obj;
  }
};

export const picker = () => (async (ctx, next) => {
  await next();
  try {
    const { query, url } = ctx.request;
    const { body } = ctx;
    if (query.pick && body && typeof body == 'object') {
      ctx.body = doPick(body, pick);
    }
  } catch(e) {
    console.log(e);
    ctx.throw(500, { message: 'internal-error' });
  }
});
