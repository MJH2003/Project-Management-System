import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TaskFieldValuesService } from './task-field-values.service';
import { CreateTaskFieldValueDto } from './dto/create-task-field-value.dto';

@Controller('task-field-values')
export class TaskFieldValuesController {
  constructor(private readonly service: TaskFieldValuesService) {}

  @Post()
  async create(@Body() dto: CreateTaskFieldValueDto) {
    return await this.service.create(dto);
  }

  @Get(':taskId')
  async getByTask(@Param('taskId') taskId: string) {
    return await this.service.findByTask(taskId);
  }
}
