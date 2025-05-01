import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { TaskFieldValuesModule } from './task-field-values/task-field-values.module';
import { AuthModule } from './auth/auth.module';
import { ProjectMembersModule } from './project-members/project-members.module';

@Module({
  imports: [
    ProjectsModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TasksModule,
    UsersModule,
    CustomFieldsModule,
    TaskFieldValuesModule,
    AuthModule,
    ProjectMembersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
