import { define } from 'typeorm-seeding';
import { User } from '../../users/entities/user.entity';
import * as Faker from 'faker';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
define(User, async (faker: typeof Faker): any => {
  const gender = faker.random.number(1);
  const user = new User();
  user.firstname = faker.name.firstName(gender);
  user.lastname = faker.name.lastName(gender);
  user.email = faker.internet.email();
  user.password = '123456';

  return user;
});
