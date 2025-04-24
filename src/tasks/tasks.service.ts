import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly db: DbService) {}

  async create(createTaskDto: CreateTaskDto) {
    return await this.db.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        project: {
          connect: { id: createTaskDto.projectId },
        },
        ...(createTaskDto.assigneeId && {
          assignee: {
            connect: { id: createTaskDto.assigneeId },
          },
        }),
        dueDate: createTaskDto.dueDate
          ? new Date(createTaskDto.dueDate)
          : undefined,
      },
    });
  }

  async findAll() {
    return await this.db.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
    });
  }

  async findOne(id: string) {
    const task = await this.db.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
        TaskFieldValue: {
          include: { field: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`The Task with id ${id} does not exist`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);

    return await this.db.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        priority: updateTaskDto.priority,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return await this.db.task.delete({
      where: { id },
    });
  }
}
