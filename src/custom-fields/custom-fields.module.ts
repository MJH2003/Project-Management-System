import { Module } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { DbService } from 'src/db/db.service';
import { DynamicDataSourceService } from './dynamic-data-sourse.service';

@Module({
  controllers: [CustomFieldsController],
  providers: [CustomFieldsService, DbService, DynamicDataSourceService],
})
export class CustomFieldsModule {}
