import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination
} from 'nestjs-typeorm-paginate';
import tryCatch from '../utils/tryCatch';
import { validate } from 'class-validator';
import { ValidationError } from 'class-validator/types/validation/ValidationError';
import { validationToHuman } from '../utils/validation';
import { normalizeQueriesWithAndSearch } from '../utils/objectUtils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  public findAll(
    options: IPaginationOptions,
    filters: UpdateUserDto
  ): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options, {
      where: normalizeQueriesWithAndSearch(filters)
    });
  }

  public async findOneByParameters(
    parameters: Partial<User>,
    withPassword = false
  ) {
    const selection: (keyof User)[] = ['id', 'firstname', 'lastname', 'email'];

    if (withPassword) {
      selection.push('password');
    }

    const [err, user] = await tryCatch(
      this.usersRepository.findOne({
        where: { ...parameters },
        select: selection
      })
    );

    if (err) {
      throw new InternalServerErrorException();
    }

    return user;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const userCreated: User = this.usersRepository.create(createUserDto);
    const errors: ValidationError[] = await validate(userCreated);

    if (errors.length) {
      throw new BadRequestException(validationToHuman(errors));
    }

    const [err, user]: [string, User] = await tryCatch(
      this.usersRepository.save(userCreated)
    );

    if (err) {
      throw new InternalServerErrorException();
    }

    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const [err, user] = await tryCatch(
      this.usersRepository.findOne(id, {
        select: ['id', 'firstname', 'lastname', 'email', 'password']
      })
    );

    if (err) {
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new UnprocessableEntityException();
    }

    const updateUser = this.usersRepository.create({
      ...user,
      ...updateUserDto
    });

    const errors: ValidationError[] = await validate(updateUser);

    if (errors.length) {
      throw new BadRequestException(validationToHuman(errors));
    }

    if (updateUserDto.password) {
      const [hashError] = await tryCatch(updateUser.hashPassword());

      if (hashError) {
        throw new InternalServerErrorException();
      }
    }

    const [saveError, savedUser]: [string, User] = await tryCatch(
      this.usersRepository.save(updateUser)
    );

    if (saveError) {
      throw new InternalServerErrorException();
    }

    return savedUser;
  }

  public async remove(id: number): Promise<void> {
    const [err, user] = await tryCatch(this.usersRepository.findOne(id));

    if (err) {
      throw new InternalServerErrorException();
    }

    if (!user) {
      throw new UnprocessableEntityException();
    }

    await this.usersRepository.delete(user);
  }
}
