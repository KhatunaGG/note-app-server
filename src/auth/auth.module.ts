import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    EmailSenderModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],




  // exports: [AuthService]
})
export class AuthModule {}
