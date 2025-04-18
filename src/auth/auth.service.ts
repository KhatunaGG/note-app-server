import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(createAuthDto: CreateAuthDto) {
    try {
      const { email, password } = createAuthDto;
      if (!email || !password)
        throw new BadRequestException('Email address and password required');
      const existingUser = await this.userService.findOne({ email });
      if (existingUser) throw new BadRequestException('User already exist');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        password: hashedPassword,
      };
      await this.userService.create(newUser);
      return { success: true, message: 'User registered successfully' };
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
