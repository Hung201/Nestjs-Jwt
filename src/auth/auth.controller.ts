import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly authService: AuthService
  ) { }

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Fetch Login")
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }


  @Post('check-code')
  @Public()
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body("email") email: string) {
    return this.authService.retryActive(email);
  }


  @Post('retry-password')
  @Public()
  retryPassword(@Body("email") email: string) {
    return this.authService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
      .sendMail({
        to: 'hungphammanh777@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: "register",
        context: {
          name: "Hung",
          activationCode: 123456
        }
      })
    return "ok";
  }
}
