import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

    findAll(completed?: string, search?: string) {
        if(completed == undefined && search == undefined) {
            return this.prisma.task.findMany();
        }
        const isCompleted = completed === 'true' // melhor leitura da comparação para aprendizado.
        return this.prisma.task.findMany({
            where: {
                ...(completed !== undefined && {
                    completed: isCompleted,
                }),
                ...(search !== undefined && {
                    title: {
                        contains: search,
                    },
                }),
            },
        });
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
                title: createTaskDto.title,
            },
        });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        await this.findOne(id);

        return this.prisma.task.update({
            where: { id },
            data: updateTaskDto,
        });
    }

    async delete(id: number) {
        await this.findOne(id);

        return this.prisma.task.delete({
            where: { id },
        });
    }
}