import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @ApiProperty({ example: '60f7b2d...' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({ example: 'Maison' })
  @Prop({ required: true })
  label: string;

  @ApiProperty({ example: '123 Avenue de la Paix, Kinshasa' })
  @Prop({ required: true })
  address: string;

  @ApiProperty({ example: -4.3217 })
  @Prop({ required: true })
  latitude: number;

  @ApiProperty({ example: 15.3125 })
  @Prop({ required: true })
  longitude: number;

  @ApiProperty({ example: true })
  @Prop({ default: false })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.index({ userId: 1 });
