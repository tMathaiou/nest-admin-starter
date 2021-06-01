import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import tryCatch from '../utils/tryCatch';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  public async validate(email: string, password: string): Promise<User> {
    const [err, user]: [string, User] = await tryCatch(
      this.authService.validateUser(email, password)
    );

    if (err) {
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
