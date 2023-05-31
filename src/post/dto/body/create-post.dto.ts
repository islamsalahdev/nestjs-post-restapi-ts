import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(5)
  @IsString()
  name: string;

  @MinLength(5)
  @IsString()
  description: string;
}
