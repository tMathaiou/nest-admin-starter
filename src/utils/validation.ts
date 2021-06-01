import { ValidationError } from 'class-validator/types/validation/ValidationError';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { getManager, Not } from 'typeorm';
import tryCatch from './tryCatch';
import { User } from '../users/entities/user.entity';

export function validationToHuman(
  errors: ValidationError[]
): { [p: string]: { [p: string]: string } }[] {
  return errors.map((err) => {
    return {
      [err.property]: err.constraints
    };
  });
}

@ValidatorConstraint()
export class EmailExistValidation implements ValidatorConstraintInterface {
  public async validate(
    email: string,
    validationArguments: ValidationArguments
  ): Promise<boolean> {
    const entityManager = getManager();
    const { id } = validationArguments.object as User;

    const [err, user]: [string, User] = await tryCatch(
      entityManager.findOne(User, {
        where: { email, id: Not(id) },
        select: ['id']
      })
    );

    if (err) {
      throw new Error(err);
    }

    return !user;
  }
}
