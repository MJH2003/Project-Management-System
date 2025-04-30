import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DbService } from '../db/db.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly db: DbService,
    private readonly jwt: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { message: `user created successfully, user id: ${user.id}` };
  }

  async login(email: string, password: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwt.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
