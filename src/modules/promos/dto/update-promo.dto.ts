import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdatePromoDto {
  @ApiPropertyOptional({ example: 'New User' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ example: 'First time User' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Enjoy 15% Off' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: '* Order on above $150' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: ['#E8453C', '#F5A623'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional({
    example: 'https://cdn.fooddash.com/promos/new-user.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2026-03-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-03-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
