import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class DynamicDataSourceService {
  constructor(private readonly db: DbService) {}

  async findAll() {
    return await this.db.dynamicDataSource.findMany();
  }

  async initializeDefaultSources() {
    const defaultSources = [
      {
        name: 'Project Members',
        sourceType: 'PROJECT_MEMBERS',
        description: 'All members of the current project',
      },
      {
        name: 'Project Tasks',
        sourceType: 'TASKS',
        description: 'All tasks in the current project',
      },
      {
        name: 'Projects',
        sourceType: 'PROJECTS',
        description: 'All projects accessible to the user',
      },
    ];

    for (const source of defaultSources) {
      await this.db.dynamicDataSource.upsert({
        where: { sourceType: source.sourceType },
        update: source,
        create: source,
      });
    }

    return await this.findAll();
  }

  async getSourceData(sourceType: string, contextData: any) {
    switch (sourceType) {
      case 'PROJECT_MEMBERS':
        return this.getProjectMembers(contextData.projectId);
      case 'TASKS':
        return this.getProjectTasks(contextData.projectId);
      case 'PROJECTS':
        return this.getUserProjects(contextData.userId);
      default:
        return [];
    }
  }

  private async getProjectMembers(projectId: string) {
    const members = await this.db.projectMember.findMany({
      where: { projectId },
      include: { user: true },
    });

    return members.map((member) => ({
      id: member.user.id,
      value: member.user.id,
      label: member.user.name,
    }));
  }

  private async getProjectTasks(projectId: string) {
    const tasks = await this.db.task.findMany({
      where: { projectId },
    });

    return tasks.map((task) => ({
      id: task.id,
      value: task.id,
      label: task.title,
    }));
  }

  private async getUserProjects(userId: string) {
    const projects = await this.db.project.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    });

    return projects.map((project) => ({
      id: project.id,
      value: project.id,
      label: project.name,
    }));
  }
}
