import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateLivreurDto {
  @ApiProperty({ example: 'Jean Mukendi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+243991234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, {
    message:
      'Format invalide. Le numéro doit commencer par + suivi de 10-15 chiffres',
  })
  phone: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'Lubumbashi, avenue du Commerce', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ enum: ['moto', 'velo', 'voiture'], example: 'moto', required: false })
  @IsString()
  @IsOptional()
  @IsIn(['moto', 'velo', 'voiture'])
  vehicleType?: string;

  @ApiProperty({ example: 'L1234567', required: false })
  @IsString()
  @IsOptional()
  cin?: string;

  @ApiProperty({ example: 'Disponible le weekend', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLivreurDto {
  @ApiProperty({ example: 'Jean Mukendi', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '+243991234567', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\+\d{10,15}$/, {
    message: 'Format invalide',
  })
  phone?: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'Lubumbashi, avenue du Commerce', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ enum: ['moto', 'velo', 'voiture'], required: false })
  @IsString()
  @IsOptional()
  @IsIn(['moto', 'velo', 'voiture'])
  vehicleType?: string;

  @ApiProperty({ example: 'L1234567', required: false })
  @IsString()
  @IsOptional()
  cin?: string;

  @ApiProperty({ example: 'Disponible le weekend', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
