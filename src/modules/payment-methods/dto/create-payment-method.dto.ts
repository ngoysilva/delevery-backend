import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'M-Pesa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '#4CAF50' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 'mobile_money' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
