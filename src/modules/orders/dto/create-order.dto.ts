import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsInt,
  Min,
  IsNumber,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: '60f7b2d...' })
  @IsString()
  @IsNotEmpty()
  foodId: string;

  @ApiProperty({ example: 'Normal' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ example: 3, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class DeliveryAddressDto {
  @ApiProperty({ example: -4.3217 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 15.3125 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: '123 Avenue de la Paix, Kinshasa' })
  @IsString()
  @MinLength(5)
  address: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'M-Pesa' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ example: '+243991234567' })
  @IsString()
  @MinLength(8)
  phoneNumber: string;

  @ApiProperty({ type: DeliveryAddressDto })
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;
}
