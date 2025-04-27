import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ResendLinkDto } from './dto/resend-link.dto';
import { GoogleGuard } from './guard/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() createUserDto: CreateUserDto) {
    return this.authService.signIn(createUserDto);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  gerCurrentUser(@Req() req) {
    return this.authService.getCurrentUser(req.userId);
  }

  @Post('check-by-email')
  resendLink(@Body() email: ResendLinkDto) {
    return this.authService.resendLink(email);
  }

  @Post('/reset-password')
  resetPassword(@Body() body) {
    return this.authService.resetPassword(body.newPassword, body.linkToken);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async signInWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req, @Res() res) {
    const token = await this.authService.signInWithGoogle(req.user);
    res.redirect(`${process.env.FRONT_URL}/sign-in?token=${token}`)
  }



  //******************** */
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Get()
  getAllUser() {
    return this.authService.getAllUser();
  }
}
