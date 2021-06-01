import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOneByParameters: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call userService findAll', () => {
      jest.spyOn(usersService, 'findAll').mockReturnValue('findAll' as any);

      controller.findAll(1, 10, 1, 'test1', 'test2', 'test@email.com');

      expect(usersService.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        {
          email: 'test@email.com',
          firstname: 'test1',
          id: 1,
          lastname: 'test2'
        }
      );
    });
  });

  describe('findOne', () => {
    it('should call userService findOneByParameters', () => {
      jest
        .spyOn(usersService, 'findOneByParameters')
        .mockReturnValue('findOneByParameters' as any);

      controller.findOne('1');

      expect(usersService.findOneByParameters).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('create', () => {
    it('should call userService create', () => {
      jest.spyOn(usersService, 'create').mockReturnValue('create' as any);

      const user: CreateUserDto = {
        email: 'test@email.com',
        firstname: 'test',
        lastname: 'test1',
        password: '1234'
      };

      controller.create(user);

      expect(usersService.create).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should call userService update', () => {
      jest.spyOn(usersService, 'update').mockReturnValue('update' as any);

      const user: UpdateUserDto = {
        id: 1,
        email: 'test@email.com',
        firstname: 'test',
        lastname: 'test1',
        password: '1234'
      };

      controller.update('1', user);

      expect(usersService.update).toHaveBeenCalledWith(1, user);
    });
  });

  describe('remove', () => {
    it('should call userService remove', () => {
      jest.spyOn(usersService, 'remove').mockReturnValue('remove' as any);

      controller.remove('1');

      expect(usersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
