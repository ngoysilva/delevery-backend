import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreatePromoDto {
  @ApiProperty({ example: 'New User' })
  @IsString()
  @IsNotEmpty()
  badge: string;

  @ApiProperty({ example: 'First time User' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Enjoy 15% Off' })
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @ApiPropertyOptional({ example: '* Order on above $150' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: ['#E8453C', '#F5A623'] })
  @IsArray()
  @IsString({ each: true })
  colors: string[];

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

  @ApiProperty({ example: '2026-03-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-03-31T23:59:59Z' })
  @IsDateString()
  endDate: string;
}
