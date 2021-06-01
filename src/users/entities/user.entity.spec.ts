import tryCatch from '../../utils/tryCatch';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User', () => {
  describe('hashPassword', () => {
    it('should return undefined', async () => {
      const user = new User();

      expect(await user.hashPassword()).toBe(undefined);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockReturnValue(
          new Promise((resolve, reject) => reject('error')) as any
        );
      const user = new User();
      user.password = 'hey';

      const [err] = await tryCatch(user.hashPassword());

      expect(err).not.toBe(null);
    });

    it('should return someHash', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockReturnValue(new Promise((resolve) => resolve('someHash')) as any);
      const user = new User();
      user.password = 'hey';
      await user.hashPassword();

      expect(user.password).toBe('someHash');
    });
  });

  describe('verifyPassword', () => {
    it('should throw an error', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValue(
          new Promise((resolve, reject) => reject('error')) as any
        );
      const user = new User();

      const [err] = await tryCatch(user.verifyPassword('somePassword'));

      expect(err).not.toBe(null);
    });

    it('should return true', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValue(new Promise((resolve) => resolve(true)) as any);
      const user = new User();

      expect(await user.verifyPassword('somePassword')).toBe(true);
    });
  });
});
