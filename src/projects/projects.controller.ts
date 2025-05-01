import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { ProjectService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return await this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectService.findOne(id);
  }

  @Get(':projectId/tasks')
  async getTasksForProject(@Param('projectId') projectId: string) {
    return await this.projectService.getTasksForProject(projectId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectService.delete(id);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') projectId: string,
    @Body() body: AddProjectMemberDto,
  ) {
    return await this.projectService.addMember(projectId, body.userId);
  }

  @Get('my-projects/:userId')
  async findAllForUser(@Param('userId') userId: string) {
    return await this.projectService.findAllForUser(userId);
  }
}
