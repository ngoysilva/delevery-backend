import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @ApiProperty({ example: 'Green Kitchen' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: -4.315 })
  @Prop({ required: true })
  latitude: number;

  @ApiProperty({ example: 15.308 })
  @Prop({ required: true })
  longitude: number;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
