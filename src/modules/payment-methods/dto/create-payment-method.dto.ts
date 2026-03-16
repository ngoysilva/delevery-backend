import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, Matches } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'M-Pesa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiProperty({ example: 'mobile_money' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Congo (RDC)' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '+243' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,4}$/, {
    message: 'Le code pays doit commencer par + suivi de 1 à 4 chiffres',
  })
  countryCode: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
