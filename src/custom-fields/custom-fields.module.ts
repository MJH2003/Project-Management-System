import { Module } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { FieldSourceController } from './field-source.controller';
import { DbService } from 'src/db/db.service';
import { DataSourceService } from './date-source.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [CustomFieldsController, FieldSourceController],
  providers: [CustomFieldsService, DbService, DataSourceService],
  exports: [DataSourceService],
})
export class CustomFieldsModule {}
