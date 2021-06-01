import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import tryCatch from '../../utils/tryCatch';
import { EmailExistValidation } from '../../utils/validation';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty({ message: 'firstname is required!' })
  public firstname: string;

  @Column()
  @IsNotEmpty({ message: 'lastname is required!' })
  public lastname: string;

  @Column({
    unique: true,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value
    }
  })
  @IsNotEmpty({ message: 'email is required!' })
  @IsEmail({}, { message: 'Incorrect email' })
  @Validate(EmailExistValidation, {
    message: 'The email already exist!'
  })
  public email: string;

  @Column({
    select: false
  })
  @MinLength(6, {
    message: 'The password must be at least 6 characters'
  })
  @IsNotEmpty({ message: 'password is required!' })
  public password: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    select: false,
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    select: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  public updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) {
      return;
    }

    const [err, hash]: [string, string] = await tryCatch(
      bcrypt.hash(this.password, 10)
    );

    if (err) {
      throw new Error(err);
    }

    this.password = hash;
  }

  public async verifyPassword(password: string): Promise<boolean> {
    const [err, isMatch]: [string, boolean] = await tryCatch(
      bcrypt.compare(password, this.password)
    );

    if (err) {
      throw new Error(err);
    }

    return isMatch;
  }
}
