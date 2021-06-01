import * as fs from 'fs';
import * as dotenv from 'dotenv';

if (fs.existsSync('./.env')) {
  dotenv.config({ path: './.env' });
} else {
  throw new Error('Invalid path env');
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET
};
