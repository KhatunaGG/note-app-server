import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
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

  async signIn({ email, password }: CreateUserDto) {
    console.log(email, 'email');
    try {
      const existingUser = await this.userService.findUserForPasswordsCompare({
        email,
      });
      if (!existingUser) throw new BadRequestException('Invalid credentials');
      const isPasswordEqual = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!isPasswordEqual)
        throw new BadRequestException('Invalid credentials');
      const payload = {
        sub: existingUser._id,
      };

      const accessToken = await this.jwtService.signAsync(payload);
      console.log(accessToken, 'accessToken');
      return { accessToken };
    } catch (e) {
      throw e;
    }
  }

  async getCurrentUser(userId: Types.ObjectId | string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      const currentUser = await this.userService.getById(userId);
      // const existingCompany = await this.userService
      //   .getById(userId)
      //   .populate('uploadedFiles');
      return currentUser;
    } catch (error) {
      console.log(error);
    }
  }

  /****************************** */

  getAllUser() {
    return this.userService.findAll();
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
