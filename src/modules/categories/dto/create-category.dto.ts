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
