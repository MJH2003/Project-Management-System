import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, DbService],
})
export class TasksModule {}
