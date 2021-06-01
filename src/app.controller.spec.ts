import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let controller: AppController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AuthService, useValue: { login: jest.fn() } }]
    }).compile();

    controller = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call auth service', () => {
      const user = { email: 'some@email.com', id: '1' };
      jest.spyOn(authService, 'login').mockImplementation(() => null);

      controller.login({ user });

      expect(authService.login).toHaveBeenCalledWith(user);
    });
  });
});
