import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { TaskFieldValuesModule } from './task-field-values/task-field-values.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
