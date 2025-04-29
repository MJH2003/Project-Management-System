import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly db: DbService) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.db.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
  async findAll() {
    return await this.db.user.findMany();
  }

  async findOne(id: string) {
    return await this.db.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.db.user.delete({
      where: { id },
    });
  }
}
