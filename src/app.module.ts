import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { MjhModule } from './mjh/mjh.module';

@Module({
  imports: [
    ProjectsModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TasksModule,
    UsersModule,
    MjhModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
