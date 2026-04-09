import { IsBoolean, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
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
        example: false,
        description: 'Atualizar status de conclusão da tarefa',
        required: false
    })
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}