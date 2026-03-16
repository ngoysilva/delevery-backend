import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: '+243991234567',
    description: 'Numéro complet avec indicatif pays',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, {
    message: 'Format invalide. Le numéro doit commencer par + suivi de 10-15 chiffres',
  })
  phoneNumber: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: '+243991234567',
    description: 'Numéro complet avec indicatif pays',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, {
    message: 'Format invalide. Le numéro doit commencer par + suivi de 10-15 chiffres',
  })
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: 'Code OTP à 6 chiffres' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'Le code OTP doit contenir exactement 6 chiffres',
  })
  code: string;
}
