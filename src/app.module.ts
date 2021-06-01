import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

if (fs.existsSync('./.env')) {
  dotenv.config({ path: './.env' });
} else {
  throw new Error('Invalid path env');
}

const dataBaseEnv: {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      ...dataBaseEnv,
      type: 'mysql',
      entities: [User],
      synchronize: true
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
