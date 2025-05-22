import { Module } from '@nestjs/common';
import { TaskFieldValuesController } from './task-field-values.controller';
import { TaskFieldValuesService } from './task-field-values.service';
import { DbService } from 'src/db/db.service';
import { CustomFieldsModule } from '../custom-fields/custom-fields.module';

@Module({
  imports: [CustomFieldsModule],
  controllers: [TaskFieldValuesController],
  providers: [TaskFieldValuesService, DbService],
})
export class TaskFieldValuesModule {}
