export const chain = (...args) => args.reduce((res, e) => res.concat(e), []);
