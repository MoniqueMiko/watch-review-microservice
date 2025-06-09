import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'O campo user é obrigatório' })
  @IsNumber({}, { message: 'O campo user deve ser um número' })
  user: number;

  @IsNotEmpty({ message: 'O comentário é obrigatório' })
  @IsString({ message: 'O comentário deve ser uma string' })
  @MinLength(6, { message: 'comentário deve ter no mínimo 6 caracteres' })
  @MaxLength(255, { message: 'O comentário deve ter no máximo 255 caracteres' })
  comments: string;

  @IsNotEmpty({ message: 'A classificação é obrigatória' })
  @IsNumber({}, { message: 'A classificação deve ser uma número' })
  classification: number;
}
