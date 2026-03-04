import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '60f7b2d...', description: 'ID du plat' })
  @IsString()
  @IsNotEmpty()
  foodId: string;

  @ApiProperty({ example: 'Normal', description: 'Taille choisie' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 2, minimum: 1, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;
}
