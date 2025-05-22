import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { DataSourceType } from '@prisma/client';

export interface OptionItem {
  id: string;
  value: string;
  label: string;
}

export interface SourceContextData {
  projectId?: string;
  userId?: string;
  taskId?: string;
}

@Injectable()
export class DataSourceService {
  constructor(private readonly db: DbService) {}

  async getSourceData(
    sourceType: DataSourceType,
    contextData: SourceContextData,
  ): Promise<OptionItem[]> {
    switch (sourceType) {
      case DataSourceType.PROJECT_MEMBERS:
        if (!contextData.projectId) {
          throw new Error('projectId is required for PROJECT_MEMBERS source type');
        }
        return this.getProjectMembers(contextData.projectId);
      case DataSourceType.TASKS:
        if (!contextData.projectId) {
          throw new Error('projectId is required for TASKS source type');
        }
        return this.getProjectTasks(contextData.projectId);
      case DataSourceType.PROJECTS:
        if (!contextData.userId) {
          throw new Error('userId is required for PROJECTS source type');
        }
        return this.getUserProjects(contextData.userId);
      default:
        return [];
    }
  }

  async getAllSourceTypes(): Promise<
    { sourceType: DataSourceType; name: string; description: string }[]
  > {
    return [
      {
        sourceType: DataSourceType.PROJECT_MEMBERS,
        name: 'Project Members',
        description: 'All members of the current project',
      },
      {
        sourceType: DataSourceType.TASKS,
        name: 'Project Tasks',
        description: 'All tasks in the current project',
      },
      {
        sourceType: DataSourceType.PROJECTS,
        name: 'Projects',
        description: 'All projects accessible to the user',
      },
    ];
  }

  private async getProjectMembers(projectId: string): Promise<OptionItem[]> {
    if (!projectId) return [];

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

  private async getProjectTasks(projectId: string): Promise<OptionItem[]> {
    if (!projectId) return [];

    const tasks = await this.db.task.findMany({
      where: { projectId },
    });

    return tasks.map((task) => ({
      id: task.id,
      value: task.id,
      label: task.title,
    }));
  }

  private async getUserProjects(userId: string): Promise<OptionItem[]> {
    if (!userId) return [];

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
