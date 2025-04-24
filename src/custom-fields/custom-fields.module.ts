import { Module } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [CustomFieldsController],
  providers: [CustomFieldsService, DbService],
})
export class CustomFieldsModule {}
