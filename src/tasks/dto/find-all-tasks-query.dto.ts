import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class FindAllTasksQueryDto {
    @ApiPropertyOptional({
        example: 'true',
        description: 'Filtra tarefas concluídas ou não concluídas'
    })
    @IsOptional()
    @IsIn(['true', 'false'])
    completed?: string;

    @ApiPropertyOptional({
        example: 'Estudar',
        description: 'Filtra tarefas por título',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Página atual',
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Quantidade de itens por página',
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        example: 'createdAt',
        description: 'Campo usado para ordenação',
        enum: ['id', 'title', 'completed', 'createdAt', 'updatedAt', 'dueDate'],
        default: 'createdAt'
    })
    @IsOptional()
    @IsIn(['id', 'title', 'completed', 'createdAt', 'updatedAt', 'dueDate'])
    orderBy?: 'id' | 'title' | 'completed' | 'createdAt' | 'updatedAt' | 'dueDate' = 'createdAt';

    @ApiPropertyOptional({
        example: 'desc',
        description: 'Ordem de ordenação',
        enum: ['asc', 'desc'],
        default: 'desc'
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc' = 'desc';
}