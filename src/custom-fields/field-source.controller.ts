import { Controller, Get, Query } from '@nestjs/common';
import { FieldSourceType, FieldSourceOptions } from './dto/field-source-type.enum';
import { DbService } from '../db/db.service';

@Controller('field-sources')
export class FieldSourceController {
  constructor(private readonly db: DbService) {}

  @Get()
  async getOptions(
    @Query('sourceType') sourceType: FieldSourceType,
    @Query('projectId') projectId?: string,
  ): Promise<any[]> {
    switch (sourceType) {
      case FieldSourceType.PROJECT_MEMBERS:
        if (!projectId) {
          throw new Error('projectId is required for PROJECT_MEMBERS source type');
        }
        const members = await this.db.projectMember.findMany({
          where: { projectId },
          include: { user: true },
        });
        return members.map(m => ({
          id: m.userId,
          name: m.user.name,
          email: m.user.email,
        }));

      case FieldSourceType.PROJECT_TASKS:
        if (!projectId) {
          throw new Error('projectId is required for PROJECT_TASKS source type');
        }
        const tasks = await this.db.task.findMany({
          where: { projectId },
        });
        return tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
        }));

      case FieldSourceType.PROJECTS:
        const projects = await this.db.project.findMany();
        return projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
        }));

      default:
        throw new Error('Invalid source type');
    }
  }
}
