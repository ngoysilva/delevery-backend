import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PaymentMethodDocument = PaymentMethod & Document;

@Schema({ timestamps: true })
export class PaymentMethod {
  @ApiProperty({ example: 'M-Pesa' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'https://example.com/logo.png' })
  @Prop({ required: true })
  logo: string;

  @ApiProperty({ example: 'mobile_money' })
  @Prop({ required: true })
  type: string;

  @ApiProperty({ example: 'Congo (RDC)' })
  @Prop({ required: true })
  country: string;

  @ApiProperty({ example: '+243' })
  @Prop({ required: true })
  countryCode: string;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
