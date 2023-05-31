import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterPostDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  skip: number;

  @Transform(({ value }) => value.toString())
  @IsOptional()
  @IsNotEmpty()
  select: string;

  @Transform(({ value }) => value.toString())
  @IsOptional()
  sort: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  limit: number;
}
