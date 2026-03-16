import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdatePaymentMethodDto {
  @ApiPropertyOptional({ example: 'M-Pesa' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: 'mobile_money' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'Congo (RDC)' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '+243' })
  @IsOptional()
  @IsString()
  @Matches(/^\+\d{1,4}$/, {
    message: 'Le code pays doit commencer par + suivi de 1 à 4 chiffres',
  })
  countryCode?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
