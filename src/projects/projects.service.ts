import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DbService } from 'src/db/db.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: DbService) {}

  async create(createProjectDto: CreateProjectDto, ownerId: string) {
    return await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        owner: {
          connect: { id: ownerId },
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

  async addMember(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    await this.prisma.projectMember.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      update: {},
      create: {
        projectId,
        userId,
      },
    });

    return { message: 'User added to project successfully' };
  }

  async findAllForUser(userId: string) {
    return await this.prisma.project.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        owner: true,
        tasks: true,
        members: true,
      },
    });
  }

  async removeMember(
    projectId: string,
    memberId: string,
    currentUserId: string,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    if (project.ownerId !== currentUserId) {
      throw new ForbiddenException('Only the project owner can remove members');
    }

    await this.prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
    });

    return { message: 'Member removed from project' };
  }
}
