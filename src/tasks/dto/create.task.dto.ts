import { IsString, IsNotEmpty, MinLength, IsBoolean, IsOptional } from "class-validator";
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
        example: false,
        description: 'Status de conclusão da tarefa',
        required: false
    })
    
    @IsBoolean()
    @IsOptional()
    completed?: boolean
}