import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProjectsModule } from './projects/projects.module';
import { DbModule } from './db/db.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { TaskFieldValuesModule } from './task-field-values/task-field-values.module';
import { AuthModule } from './auth/auth.module';

import { DynamicDataSourceService } from './custom-fields/dynamic-data-sourse.service';
import { DbService } from './db/db.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectsModule,
    DbModule,
    TasksModule,
    UsersModule,
    CustomFieldsModule,
    TaskFieldValuesModule,
    AuthModule,
  ],
  providers: [DynamicDataSourceService, DbService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly dynamicSourceService: DynamicDataSourceService,
  ) {}

  async onModuleInit() {
    await this.dynamicSourceService.initializeDefaultSources();
  }
}
