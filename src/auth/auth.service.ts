import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import { validate as isUUD } from 'uuid';

import * as bcrypt from 'bcrypt';

import { LoginUserDto, RegisterUserDto, CreateUserDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
    private readonly jwtService :JwtService,
  ){}

  async create(createUserDto: CreateUserDto):Promise<User> {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password:bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      delete user.password;

      return user;
      
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async register(registerDto:RegisterUserDto):Promise<LoginResponse> {

    const user = await this.create( registerDto );

    return {
      user:user,
      token: this.getJwToken({id:user.id})
    };
  }

  
  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {

    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where:{ email },
      select:{ 
        email:true, 
        password:true, 
        fullName:true,
        roles:true,
        id:true 
      }
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid')
    
    if ( !bcrypt.compareSync( password, user.password) )
      throw new UnauthorizedException('Credentials are not valid')

    return {
      user,
      token: this.getJwToken({ id: user.id })
    };
  }

  public getJwToken(payload:JwtPayload) {

    const token = this.jwtService.sign( payload );

    return token;

  }

  async findAll(paginationDto : PaginationDto):Promise<User[]> {
    const { limit = 5, offset = 0 } = paginationDto;
    return this.userRepository.find({
      take:limit,
      skip:offset,
    })
  }

  async findUserById(id:string) {
    const user = await this.findOne(id);
    const {password, ...rest} = user;
    return rest;
  }

  async findOne(term: string) {
    let user: User;

    if( isUUD(term) ) {
      user = await this.userRepository.findOneBy({id:term});
    } 

    if (!user) throw new NotFoundException(`User with ${term} not found`);

    return user;
  }

  async checkAuthStatus( user:User ) {

    return {
      ...user,
      token: this.getJwToken({id:user.id})
    };
  }



  private handleDbErrors(error:any): never {
    if (error.code === '23505')
      throw new BadRequestException( error.detail )

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
  
}
