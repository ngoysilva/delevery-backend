import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsIn,
  Min,
  Max,
} from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({ example: 'Salad With Shirataki' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'A delicious salad with shirataki noodles.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ['https://cdn.fooddash.com/food/salad-1.jpg'] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: 40500 })
  @IsNumber()
  @Min(0)
  prix: number;

  @ApiPropertyOptional({ example: 80000 })
  @IsOptional()
  @IsNumber()
  ancienPrix?: number;

  @ApiPropertyOptional({ example: '50% OFF' })
  @IsOptional()
  @IsString()
  discount?: string;

  @ApiProperty({ example: 4.0, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  note: number;

  @ApiProperty({ example: '60f7b2d...' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: '60f7b2d...' })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({ example: 'Handmade Restaurant' })
  @IsString()
  @IsNotEmpty()
  restaurantName: string;

  @ApiProperty({ example: '2 km' })
  @IsString()
  @IsNotEmpty()
  distance: string;

  @ApiProperty({ example: '10 min' })
  @IsString()
  @IsNotEmpty()
  deliveryTime: string;

  @ApiPropertyOptional({ example: ['Normal', 'Large'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    enum: ['recommended', 'popular', 'both'],
    example: 'recommended',
  })
  @IsOptional()
  @IsIn(['recommended', 'popular', 'both'])
  type?: string;
}
