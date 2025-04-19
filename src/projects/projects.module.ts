import { Module } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { ProjectController } from './projects.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, DbService],
})
export class ProjectsModule {}
