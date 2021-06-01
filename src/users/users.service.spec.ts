import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as classValidator from 'class-validator';
import tryCatch from '../utils/tryCatch';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByParameters', () => {
    it('should return error', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve, reject) => reject('error')));

      const [err] = await tryCatch(
        service.findOneByParameters({ id: 1 }, true)
      );

      expect(err).not.toBe(null);
    });

    it('should return user', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(
          new Promise((resolve) => resolve({ user: true } as any))
        );

      expect(await service.findOneByParameters({ id: 1 })).toStrictEqual({
        user: true
      });
    });
  });

  describe('create', () => {
    it('should return validation error', async () => {
      jest
        .spyOn(classValidator, 'validate')
        .mockReturnValue(['someErrors'] as any);

      const [err] = await tryCatch(service.create({} as CreateUserDto));

      expect(err).not.toBe(null);
    });

    it('should return error ', async () => {
      jest.spyOn(classValidator, 'validate').mockReturnValue(null as any);
      jest.spyOn(userRepository, 'create').mockReturnValue({} as any);
      jest
        .spyOn(userRepository, 'save')
        .mockReturnValue(new Promise((resolve, reject) => reject('error')));

      const [err] = await tryCatch(service.create({} as any));

      expect(err).not.toBe(null);
    });

    it('should return user', async () => {
      jest.spyOn(classValidator, 'validate').mockReturnValue([] as any);
      jest.spyOn(userRepository, 'create').mockReturnValue({} as any);
      jest
        .spyOn(userRepository, 'save')
        .mockReturnValue(new Promise((resolve) => resolve('user' as any)));

      expect(await service.create({} as any)).toBe('user');
    });
  });

  describe('update', () => {
    it('should return error from findOne', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve, reject) => reject('error')));

      const [err] = await tryCatch(service.update(1, {} as UpdateUserDto));

      expect(err).not.toBe(null);
    });

    it('should return error from findOne because no user', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve) => resolve(null)));

      const [err] = await tryCatch(service.update(1, {} as UpdateUserDto));

      expect(err).not.toBe(null);
    });

    it('should return validation error', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve) => resolve({} as any)));
      jest.spyOn(userRepository, 'create').mockReturnValue({} as any);
      jest
        .spyOn(classValidator, 'validate')
        .mockReturnValue(['someErrors'] as any);

      const [err] = await tryCatch(service.update(1, {} as UpdateUserDto));

      expect(err).not.toBe(null);
    });

    it('should return hash error', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve) => resolve({} as any)));
      jest.spyOn(userRepository, 'create').mockReturnValue({
        hashPassword: () => new Promise((resolve, reject) => reject('error'))
      } as any);
      jest.spyOn(classValidator, 'validate').mockReturnValue([] as any);

      const [err] = await tryCatch(
        service.update(1, { password: 'password' } as UpdateUserDto)
      );

      expect(err).not.toBe(null);
    });

    it('should return save error ', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve) => resolve({} as any)));
      jest.spyOn(userRepository, 'create').mockReturnValue({} as any);
      jest
        .spyOn(userRepository, 'save')
        .mockReturnValue(new Promise((resolve, reject) => reject('error')));
      jest.spyOn(classValidator, 'validate').mockReturnValue([] as any);

      const [err] = await tryCatch(service.update(1, {} as any));

      expect(err).not.toBe(null);
    });

    it('should return user', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve) => resolve({} as any)));
      jest.spyOn(userRepository, 'create').mockReturnValue({} as any);
      jest
        .spyOn(userRepository, 'save')
        .mockReturnValue(new Promise((resolve) => resolve('user' as any)));
      jest.spyOn(classValidator, 'validate').mockReturnValue([] as any);

      expect(await service.update(1, {} as any)).toBe('user');
    });
  });

  describe('remove', () => {
    it('should return error from findOne', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve, reject) => reject('error')));

      const [err] = await tryCatch(service.remove(1));

      expect(err).not.toBe(null);
    });

    it('should return error from findOne because no user', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve) => resolve(null)));

      const [err] = await tryCatch(service.remove(1));

      expect(err).not.toBe(null);
    });

    it('should return no errors', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(new Promise((resolve) => resolve({} as User)));

      const [err] = await tryCatch(service.remove(1));

      expect(err).toBe(null);
    });
  });
});
