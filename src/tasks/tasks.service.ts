import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindAllTasksQueryDto } from './dto/find-all-tasks-query.dto';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

     async findAll(query: FindAllTasksQueryDto) {
       const { completed, search, page = 1, limit = 10, orderBy = 'createdAt', order = 'desc'} = query;

       const where = {
        ...(completed !== undefined && 
            { completed: completed === 'true'
        }),
        ...(search !== undefined &&
            search.trim() !== '' && {
                title: {
                    contains: search,
                },
            }),
       };

       const skip = (page - 1) * limit;

       const [data, total] = await Promise.all([
        this.prisma.task.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [orderBy]: order,
            },
        }),
        this.prisma.task.count({ where })
       ]);

       return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
       };
    }

    async findOne(id: number) {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });

        if(!task) {
            throw new NotFoundException(`Task com o id ${id} não encontrada`);
        }

        return task;
    }

    create(createTaskDto: CreateTaskDto){
        return this.prisma.task.create({
            data: {
                ...createTaskDto,
                dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
                title: createTaskDto.title,
            },
        });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        await this.findOne(id);

        return this.prisma.task.update({
            where: { id },
            data: {
                ...updateTaskDto,
                ...(updateTaskDto.dueDate !== undefined && {
                    dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null,
                }),
            },
        });
    }

    async delete(id: number) {
        await this.findOne(id);

        return this.prisma.task.delete({
            where: { id },
        });
    }
}