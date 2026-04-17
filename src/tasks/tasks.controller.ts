import { Body, Controller, Get, Param, Post, ParseIntPipe, Patch, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindAllTasksQueryDto } from './dto/find-all-tasks-query.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    @ApiOperation({ summary: 'Lista todas as tarefas com filtros, paginação e ordenação.' })
    @ApiQuery({ name: 'completed', required: false, description: 'Filtra as tarefas por status de conclusão.', type: String })
    @ApiQuery({ name: 'search', required: false, description: 'Filtra as tarefas por título.', type: String })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1})
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10})
    @ApiQuery({ name: 'orderBy', required: false, type: String, example: 'createdAt'})
    @ApiQuery({ name: 'order', required: false, type: String, example: 'desc'})
    @ApiResponse({ status: 200, description: 'Lista de tarefas retornada com sucesso.' })
    findAll(@Query() query: FindAllTasksQueryDto) {
        return this.tasksService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma tarefa por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1})
    @ApiResponse({ status: 200, description: 'Tarefa encontrada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Criar uma nova tarefa.' })
    @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso.' })
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza uma tarefa por ID.' })
    @ApiParam({ name: 'id', type: Number, example: 1})
    @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, example: 1})
    @ApiOperation({ summary: 'Deleta uma tarefa por ID.' })
    @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
    delete(@Param('id', ParseIntPipe) id:number){
        return this.tasksService.delete(id);
    }
}
