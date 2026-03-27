import { Injectable, NotFoundException } from '@nestjs/common';
import {Task} from './tasks.interface';
import {CreateTaskDto} from './dto/create.task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [
        {id: 1, title: "Estudar NestJS", completed: false},
        {id: 2, title: "Criar projeto To-Do-List", completed: true}
    ];

    findAll(): Task[] {
        return this.tasks;
    }

    findOne(id: number): Task {
        const task = this.tasks.find(task => task.id === id);

        if(!task) {
            throw new NotFoundException(`Task com o id ${id} não encontrada`);
        }

        return task;
    }

    create(createTaskDto: CreateTaskDto): Task{
        const newTask: Task =  {
            id: this.tasks.length + 1,
            title: createTaskDto.title,
            completed: false,
        };
        this.tasks.push(newTask);

        return newTask;
    }

    update(id: number, updateTaskDto: UpdateTaskDto): Task {
        const task = this.findOne(id);

       if(updateTaskDto.title !== undefined){
        task.title = updateTaskDto.title;
       }

       if(updateTaskDto.completed !== undefined) {
        task.completed = updateTaskDto.completed;
       }

       return task;
    }
}