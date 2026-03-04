import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsIn,
  Min,
  Max,
} from 'class-validator';

export class UpdateFoodDto {
  @ApiPropertyOptional({ example: 'Salad With Shirataki' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'A delicious salad with shirataki noodles.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['https://cdn.fooddash.com/food/salad-1.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 40500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix?: number;

  @ApiPropertyOptional({ example: 80000 })
  @IsOptional()
  @IsNumber()
  ancienPrix?: number;

  @ApiPropertyOptional({ example: '50% OFF' })
  @IsOptional()
  @IsString()
  discount?: string;

  @ApiPropertyOptional({ example: 4.0, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  note?: number;

  @ApiPropertyOptional({ example: '60f7b2d...' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: '60f7b2d...' })
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @ApiPropertyOptional({ example: 'Handmade Restaurant' })
  @IsOptional()
  @IsString()
  restaurantName?: string;

  @ApiPropertyOptional({ example: '2 km' })
  @IsOptional()
  @IsString()
  distance?: string;

  @ApiPropertyOptional({ example: '10 min' })
  @IsOptional()
  @IsString()
  deliveryTime?: string;

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
