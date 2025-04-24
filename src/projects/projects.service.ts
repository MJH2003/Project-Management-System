import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: DbService) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        owner: {
          connect: { id: createProjectDto.ownerId },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.project.findMany({
      include: {
        owner: true,
        tasks: true,
        members: true,
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        tasks: true,
        members: true,
      },
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);
    return await this.prisma.project.update({
      where: { id },
      data: {
        name: updateProjectDto.name,
        description: updateProjectDto.description,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return await this.prisma.project.delete({
      where: { id },
    });
  }

  async getTasksForProject(projectId: string) {
    return await this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: true,
        TaskFieldValue: { include: { field: true } },
      },
    });
  }
}
