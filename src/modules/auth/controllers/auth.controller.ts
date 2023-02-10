import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { CurrentUser } from '../../../common/decorators/requests/current-user.decorator';
import { User } from '@modules/users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { Serialize } from '@common/interceptors/serialize.interceptor';
import { UserDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginResponseDto } from '../dto/login-response.dto';

@ApiTags('Auth')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Serialize(UserDto)
  @ApiOperation({ summary: 'Register' })
  @Post('/register')
  async create(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login' })
  @Serialize(LoginResponseDto)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Get profile' })
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  @Get('/profile')
  getProfile(@CurrentUser() user: User) {
    return this.authService.profile(user);
  }

  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Log out' })
  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  logout(@CurrentUser() user: User) {
    this.authService.logout(user);
  }
}
