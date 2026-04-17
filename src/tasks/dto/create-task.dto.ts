import { IsString, IsNotEmpty, MinLength, IsBoolean, IsOptional, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
    @ApiProperty({
         example: 'Estudar NestJS',
         description: 'Título da tarefa',
         required: true
        })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @ApiProperty({
        example: 'Estudar NestJS',
        description: 'Descrição da tarefa',
        required: false
    })
    @IsString()
    @IsOptional()
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
        description: 'Status de conclusão da tarefa',
        required: false
    })

    @IsBoolean()
    @IsOptional()
    completed?: boolean
}