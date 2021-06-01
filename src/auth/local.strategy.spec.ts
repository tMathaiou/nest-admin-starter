import { UsersService } from '../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import tryCatch from '../utils/tryCatch';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: { validateUser: jest.fn() } }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should throw an error', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockReturnValue(
          new Promise((resolve, reject) => reject('error')) as any
        );
      const localStrategy = new LocalStrategy(authService);

      const [err] = await tryCatch(
        localStrategy.validate('test@email.com', 'password')
      );

      expect(err).not.toBe(null);
    });

    it('should return user', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockReturnValue(new Promise((resolve) => resolve('user')) as any);

      const localStrategy = new LocalStrategy(authService);

      expect(await localStrategy.validate('test@email.com', 'password')).toBe(
        'user'
      );
    });

    it('should throw an error because of no user', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockReturnValue(new Promise((resolve) => resolve(null)) as any);

      const localStrategy = new LocalStrategy(authService);

      const [err] = await tryCatch(
        localStrategy.validate('test@email.com', 'password')
      );

      expect(err).not.toBe(null);
    });
  });
});
