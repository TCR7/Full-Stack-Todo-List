import { IsBoolean, IsOptional, IsString, IsNotEmpty, IsDateString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "./create.task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto){
    @ApiProperty({
        example: 'Estudar Python',
        description: 'Atualizar título da tarefa',
        required: false
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title?: string;

    @ApiProperty({
        example: 'Nova descrição da tarefa',
        description: 'Descrição detalhada da tarefa',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: '2026-04-17T15:00:00.000Z',
        description: 'Prazo da Tarefa',
    })
    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @ApiProperty({
        example: false,
        description: 'Atualizar status de conclusão da tarefa',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}