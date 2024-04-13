import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/types/users';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    // Logic to register a user
  }

  async login({
    email,
    password,
  }: LoginAuthDto): Promise<{ access_token: string }> {
    const { data: user } = await this.httpService.axiosRef.get<User>(
      `/users/${email}?id=true&email=true&password=true`,
    );
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
