import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      callbackURL: configService.get('GOOGLE_CLIENT_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const data = {
      fullName: profile.displayName,
      email: profile.email,
      avatar: profile.picture,
    };
    done(null, data);
  }
}
