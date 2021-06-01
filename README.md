## Nest Admin Starter

## Description

Nest framework TypeScript admin starter repository.

## Installation

```bash
$ npm install OR yarn
```

Setup `.env` in order to connect to database

```bash
NODE_ENV=development
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dbname
DB_USER=dbUser
DB_PASS=dbPass
JWT_SECRET=yourSecret
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Seeding

```bash
# setup seed config
$ npm run seed:config

# seed database
$ npm run seed:run
```
