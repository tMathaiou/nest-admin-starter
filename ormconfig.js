const path = require('path'); // eslint-disable-line
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

if (fs.existsSync('./.env')) {
  dotenv.config({ path: './.env' });
} else {
  throw new Error('Invalid path env');
}

function env(key) {
  return process.env[key];
}

const baseConfig = {
  type: 'mysql',
  database: env('DB_NAME'),
  entities: [path.resolve(__dirname, 'src/**/*.entity{.ts,.js}')],
  cli: {
    migrationsDir: path.resolve('src/database/migrations')
  }
};

if (process.env.NODE_ENV !== 'test') {
  module.exports = {
    host: env('DB_HOST'),
    port: env('DB_PORT'),
    username: env('DB_USER'),
    password: env('DB_PASS'),
    synchronize: false,
    ...baseConfig
  };
} else {
  module.exports = {
    synchronize: true,
    ...baseConfig
  };
}
