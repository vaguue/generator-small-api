import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { parse } from 'dotenv';
import { expand } from 'dotenv-expand';

if (process.webpack) {
  _.assign(process.env, process.webpack);
}

const dev = (process.env.NODE_ENV || global.dev) != 'production';

if (!dev && fs.existsSync(path.resolve(process.cwd(), '.env'))) {
  const envConfig = expand(
    parse(
      fs.readFileSync(path.resolve(process.cwd(), '.env')).toString()
    )
  );

  if (typeof envConfig == 'object') {
    _.assign(process.env, envConfig);
  }
}

const options = {
  p: {
    type: 'number',
    alias: 'port',
    describe: 'port to listen to',
    envAlias: 'PORT',
  },
  db: {
    type: 'string',
    alias: 'database',
    describe: 'MongoDB uri',
    envAlias: ['MONGODB_URI_DEV', 'MONGODB_URI'],
  },
};

export default function main() {
  const argv = yargs(hideBin(process.argv)).options(options).argv;
  _.mapKeys(argv, (value, key) => {
    if (options[key]) {
      const envAlias = Array.isArray(options[key].envAlias) ? options[key].envAlias : [options[key].envAlias];
      envAlias.map(envKey => process.env[envKey] = value);
    }
  });
}
