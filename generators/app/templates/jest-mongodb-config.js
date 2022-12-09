module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.4.4',
      skipMD5: true,
    },
    instance: {},
    autoStart: true,
  },
  mongoURLEnvName: 'MONGODB_URI_DEV',
};
