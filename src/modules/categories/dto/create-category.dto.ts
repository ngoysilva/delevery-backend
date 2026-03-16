import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Continental', description: 'Nom de la catégorie' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    example: 'https://cdn.fooddash.com/categories/continental.jpg',
    description: "URL de l'image",
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}

export class ToggleCategoryStatusDto {
  @ApiProperty({
    enum: ['active', 'suspended'],
    example: 'suspended',
    description: 'Nouveau statut (active ou suspended)',
  })
  @IsString()
  @IsNotEmpty()
  status: 'active' | 'suspended';
}
