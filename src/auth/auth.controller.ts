import { Controller, Post, Body, Get, Param, Query, UseGuards, Request } from '@nestjs/common';

import { Auth, GetUser } from './decorators';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto, RegisterUserDto } from './dto';

import { User } from './entities/user.entity';

import { ValidRoles } from './interfaces';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { LoginResponse } from './interfaces/login-response.interface';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards( AuthGuard )   
  @Auth(ValidRoles.superUser)
  @Get()
  findAll(@Query() paginationDto : PaginationDto ) {
   return this.authService.findAll(paginationDto);
  }

  @UseGuards( AuthGuard ) 
  @Get('check-token')
  checkToken(@Request() req : Request):LoginResponse {

   const user = req['user'] as User;

   return {
      user,
      token: this.authService.getJwToken({id:user.id})
   }
  }

  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
     return this.authService.create(createUserDto);
  }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
     return this.authService.register( registerUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
     return this.authService.login(loginUserDto);
  }
  
  @Get('check-status')
  @Auth()
  checkAuthStatus(
   @GetUser() user : User
  ) {
   return this.authService.checkAuthStatus( user )
  }

  @Get('private3')
  @Auth(ValidRoles.superUser)
  privateRoute3(
   @GetUser() user: User,
  ){
   return {
      ok:true,
      user,
   }
  }
}
