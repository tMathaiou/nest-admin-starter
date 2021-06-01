import tryCatch from '../utils/tryCatch';
import { UsersService } from '../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UsersService, useValue: { findOneByParameters: jest.fn() } }
      ]
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  describe('validate', () => {
    it('should throw an error', async () => {
      jest
        .spyOn(userService, 'findOneByParameters')
        .mockReturnValue(
          new Promise((resolve, reject) => reject('error')) as any
        );
      const jwt = new JwtStrategy(userService);

      const [err] = await tryCatch(
        jwt.validate({ sub: 1, email: 'test@email.com' })
      );

      expect(err).not.toBe(null);
    });

    it('should return user', async () => {
      jest
        .spyOn(userService, 'findOneByParameters')
        .mockReturnValue(new Promise((resolve) => resolve('user')) as any);

      const jwt = new JwtStrategy(userService);

      expect(await jwt.validate({ sub: 1, email: 'test@email.com' })).toBe(
        'user'
      );
    });
  });
});
