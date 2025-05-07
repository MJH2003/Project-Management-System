import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { ProjectService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const ownerId = req.user.userId;
    return await this.projectService.create(createProjectDto, ownerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Request() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const userId = req.user.userId;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    return await this.projectService.findAllForUser(
      userId,
      pageNumber,
      limitNumber,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':projectId/tasks')
  async getTasksForProject(@Param('projectId') projectId: string) {
    return await this.projectService.getTasksForProject(projectId);
  }

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/members')
  async addMember(
    @Param('id') projectId: string,
    @Body() body: AddProjectMemberDto,
  ) {
    return await this.projectService.addMember(projectId, body.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @Request() req,
  ) {
    return this.projectService.removeMember(
      projectId,
      memberId,
      req.user.userId,
    );
  }
}
