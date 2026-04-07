import { IsBoolean, IsOptional, IsString, IsNotEmpty } from "class-validator";

export class UpdateTaskDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title?: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}