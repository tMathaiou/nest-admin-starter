import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  public findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('id') id?: number,
    @Query('firstname') firstname?: string,
    @Query('lastname') lastname?: string,
    @Query('email') email?: string
  ): Promise<Pagination<User>> {
    return this.usersService.findAll(
      { page, limit },
      { id, firstname, lastname, email }
    );
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneByParameters({ id: +id });
  }

  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @HttpCode(204)
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
