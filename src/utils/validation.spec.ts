import { EmailExistValidation, validationToHuman } from './validation';
import * as typeorm from 'typeorm';
import { of } from 'rxjs';

describe('validationToHuman', () => {
  it('should return humanized errors', () => {
    expect(
      validationToHuman([
        { property: 'key1', constraints: 'error 1' },
        { property: 'key2', constraints: 'error 2' }
      ] as any)
    ).toStrictEqual([
      {
        key1: 'error 1'
      },
      {
        key2: 'error 2'
      }
    ]);
  });
});

describe('EmailExistValidation', () => {
  it('should validate email with false', async () => {
    const emailExistValidation = new EmailExistValidation();
    jest.spyOn(typeorm, 'getManager').mockImplementation((): any => {
      return {
        findOne: jest.fn().mockImplementation(() => {
          return of({ id: 1 }).toPromise();
        })
      };
    });

    expect(
      await emailExistValidation.validate('test@email.com', {
        object: { id: 1 }
      } as any)
    ).toStrictEqual(false);
  });

  it('should validate email with true', async () => {
    const emailExistValidation = new EmailExistValidation();
    jest.spyOn(typeorm, 'getManager').mockImplementation((): any => {
      return {
        findOne: jest.fn().mockImplementation(() => {
          return of(null).toPromise();
        })
      };
    });

    expect(
      await emailExistValidation.validate('test@email.com', {
        object: { id: 1 }
      } as any)
    ).toStrictEqual(true);
  });
});
