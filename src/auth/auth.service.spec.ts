import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import mockedJwtService from '../mocks/jwt.service';
import { UsersService } from '../users/users.service';
import tryCatch from '../utils/tryCatch';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: UsersService,
          useValue: {
            findOneByParameters: () =>
              new Promise((resolve) =>
                resolve({
                  verifyPassword: () => null
                })
              )
          }
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return null without email', async () => {
      expect(await service.validateUser(null, 'somevalue')).toBe(null);
    });

    it('should return null without password', async () => {
      expect(await service.validateUser('test@email.com', null)).toBe(null);
    });

    it('should return throw an error fetching the user', async () => {
      jest
        .spyOn(usersService, 'findOneByParameters')
        .mockReturnValue(new Promise((resolve, reject) => reject('error')));

      const [err]: any = await tryCatch(
        service.validateUser('test@email.com', 'somePassword')
      );

      expect(err).not.toBe(null);
    });

    it('should return not find user', async () => {
      jest
        .spyOn(usersService, 'findOneByParameters')
        .mockReturnValue(new Promise((resolve, reject) => resolve(null)));

      expect(await service.validateUser('test@email.com', 'somePassword')).toBe(
        null
      );
    });

    it('should throw error on validate password', async () => {
      jest.spyOn(usersService, 'findOneByParameters').mockReturnValue(
        new Promise((resolve) =>
          resolve({
            verifyPassword: jest
              .fn()
              .mockReturnValue(
                new Promise((resolve, reject) => reject('error'))
              )
          })
        ) as any
      );

      const [err]: any = await tryCatch(
        service.validateUser('test@email.com', 'somePassword')
      );

      expect(err).not.toBe(null);
    });

    it('should is invalid on validate password', async () => {
      jest.spyOn(usersService, 'findOneByParameters').mockReturnValue(
        new Promise((resolve) =>
          resolve({
            verifyPassword: jest
              .fn()
              .mockReturnValue(new Promise((resolve) => resolve(false)))
          })
        ) as any
      );

      expect(await service.validateUser('test@email.com', 'somePassword')).toBe(
        null
      );
    });

    it('should return the user', async () => {
      jest.spyOn(usersService, 'findOneByParameters').mockReturnValue(
        new Promise((resolve) =>
          resolve({
            user: true,
            verifyPassword: jest
              .fn()
              .mockReturnValue(new Promise((resolve) => resolve(true)))
          })
        ) as any
      );

      expect(
        await service.validateUser('test@email.com', 'somePassword')
      ).toStrictEqual(
        expect.objectContaining({
          user: true
        })
      );
    });
  });

  describe('login', () => {
    it('should return token', async () => {
      expect(
        await service.login({ email: 'test@email.com', id: 1 } as User)
      ).toStrictEqual({ token: 'token' });
    });
  });
});
