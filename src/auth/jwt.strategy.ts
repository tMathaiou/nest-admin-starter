import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import tryCatch from '../utils/tryCatch';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret
    });
  }

  public async validate(payload: {
    sub: number;
    email: string;
  }): Promise<User> {
    const [err, user] = await tryCatch(
      this.usersService.findOneByParameters({
        id: payload.sub,
        email: payload.email
      })
    );

    if (err) {
      throw new Error(err);
    }

    return user;
  }
}
