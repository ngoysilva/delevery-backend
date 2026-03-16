import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Maison' })
  @IsString()
  label: string;

  @ApiProperty({ example: '123 Avenue de la Paix, Kinshasa' })
  @IsString()
  address: string;

  @ApiProperty({ example: -4.3217 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 15.3125 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
