import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { genSalt, hash, compare } from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUpRepository(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    try {
      const { username, password } = authCredentialsDto;

      const user = new User();
      user.username = username;
      const salt = await genSalt(10);
      user.password = await this.hashPassword(password, salt);
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Username already exist`);
      }

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (user && user.comparePassword(password)) {
      return user.username;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await hash(password, salt);
  }
}
