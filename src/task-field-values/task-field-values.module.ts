import { Module } from '@nestjs/common';
import { TaskFieldValuesController } from './task-field-values.controller';
import { TaskFieldValuesService } from './task-field-values.service';
import { DbService } from 'src/db/db.service';
import { DynamicDataSourceService } from '../custom-fields/dynamic-data-sourse.service';

@Module({
  controllers: [TaskFieldValuesController],
  providers: [TaskFieldValuesService, DbService, DynamicDataSourceService],
})
export class TaskFieldValuesModule {}
