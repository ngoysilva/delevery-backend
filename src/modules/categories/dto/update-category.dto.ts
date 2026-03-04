import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Continental',
    description: 'Nom de la catégorie',
  })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.fooddash.com/categories/continental.jpg',
    description: "URL de l'image",
  })
  @IsOptional()
  @IsString()
  image?: string;
}
