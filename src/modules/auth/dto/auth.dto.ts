import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Jean Mukendi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+243991234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, {
    message: 'Format invalide. Le numéro doit commencer par + suivi de 10-15 chiffres',
  })
  phone: string;
}

export class VerifyAuthDto {
  @ApiProperty({ example: '+243991234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, {
    message: 'Format invalide',
  })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Le code OTP doit contenir 6 chiffres' })
  code: string;
}

export class LoginDto {
  @ApiProperty({ example: '+243991234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, {
    message: 'Format invalide',
  })
  phone: string;
}
