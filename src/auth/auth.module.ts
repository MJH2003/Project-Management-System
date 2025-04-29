import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { DbModule } from '../db/db.module';

@Module({
  imports: [UsersModule, DbModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
