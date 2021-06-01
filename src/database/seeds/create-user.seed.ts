import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export default class CreateUserSeed implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    await factory(User)().createMany(10);
  }
}
