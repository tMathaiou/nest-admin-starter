import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import tryCatch from '../utils/tryCatch';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  public async validateUser(email: string, pass: string): Promise<User> {
    if (!email || !pass) {
      return null;
    }

    const [err, user] = await tryCatch(
      this.usersService.findOneByParameters({ email }, true)
    );

    if (err) {
      throw new Error(err);
    }

    if (!user) {
      return null;
    }

    const [validationError, isValid]: [string, boolean] = await tryCatch(
      user.verifyPassword(pass)
    );

    if (validationError) {
      throw new Error(validationError);
    }

    if (!isValid) {
      return null;
    }

    return user;
  }

  public async login(user: User): Promise<{ token: string }> {
    return {
      token: this.jwtService.sign({ email: user.email, sub: user.id })
    };
  }
}
