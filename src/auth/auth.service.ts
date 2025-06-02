import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { ResendLinkDto } from './dto/resend-link.dto';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private emailSender: EmailSenderService,
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
      return { accessToken };
    } catch (e) {
      throw e;
    }
  }

  async signInWithGoogle(user) {
    let existingUser = await this.userService.findOne({ email: user.email });
    if (!existingUser) existingUser = await this.userService.create(user);
    const payload = {
      sub: existingUser._id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async getCurrentUser(userId: Types.ObjectId | string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      const currentUser = await this.userService.getById(userId);
      return currentUser;
    } catch (error) {
      console.log(error);
    }
  }

  async resendLink({ email }: ResendLinkDto) {
    try {
      if (!email) throw new NotFoundException('Email is required');
      const existingUser = await this.userService.findOne({ email });
      if (!existingUser) throw new NotFoundException('User not found');

      const now = new Date();
      const RESET_INTERVAL = 24 * 60 * 60 * 1000;
      const MAX_RESENDS = 3;

      if (
        existingUser.resendCount >= MAX_RESENDS &&
        existingUser.resendCountResetAt.getTime() + RESET_INTERVAL >
          now.getTime()
      ) {
        throw new BadRequestException(
          'You’ve reached the maximum number of reset link requests (3) in the last 24 hours. Try again later.',
        );
      }
      let newResendCount = existingUser.resendCount + 1;
      let newResetAt = existingUser.resendCountResetAt;
      if (
        now.getTime() - existingUser.resendCountResetAt.getTime() >
        RESET_INTERVAL
      ) {
        newResendCount = 1;
        newResetAt = now;
      }
      const validationToken = crypto.randomUUID();
      const validationLinkValidateDate = new Date();
      validationLinkValidateDate.setTime(
        validationLinkValidateDate.getTime() + 3 * 60 * 1000,
      );

      await this.userService.updateUser(existingUser._id, {
        validationToken,
        validationLinkValidateDate,
        isVerified: false,
        resendCount: newResendCount,
        resendCountResetAt: newResetAt,
      });

      const fullValidationLink = `${'http://localhost:3000'}/reset-password?token=${validationToken}`;
      await this.emailSender.sendValidationEmail(email, fullValidationLink);
      console.log(fullValidationLink, 'fullValidationLink');

      return {
        email: email,
        message: 'Validation link sent successfully. Please check your inbox.',
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async resetPassword(newPassword: string, linkToken: string) {
    if (!newPassword || !linkToken) return;
    try {
      const existingUser = await this.userService.findOne({
        validationToken: linkToken,
        isVerified: false,
      });
      if (!existingUser) {
        throw new NotFoundException('User not found or already verified');
      }
      const now = new Date();
      if (now > existingUser.validationLinkValidateDate) {
        throw new BadRequestException(
          'Verification link has expired. Please request a new one.',
        );
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updateUser(existingUser._id, {
        password: hashedPassword,
        isVerified: true,
        validationToken: null,
        validationLinkValidateDate: null,
      });
      console.log(existingUser, 'existingUser');

      return { message: 'Password updated successfully' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async changePassword(
    userId: Types.ObjectId | string,
    oldPassword: string,
    newPassword: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      const existingUser = await this.userService.getById(userId);
      if (!existingUser) throw new NotFoundException('User not found');
      const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
      if (!isMatch) throw new BadRequestException('Old password is incorrect');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();

      return { message: 'Password updated successfully' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
