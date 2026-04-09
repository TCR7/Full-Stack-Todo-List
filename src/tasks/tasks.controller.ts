import { Body, Controller, Get, Param, Post, ParseIntPipe, Patch, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    findAll(
        @Query('completed') completed?: string,
        @Query('search') search?: string,
    ) {
        return this.tasksService.findAll(completed, search);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.findOne(id);
    }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.tasksService.delete(id);
    }
}
