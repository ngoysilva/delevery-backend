import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PromoDocument = Promo & Document;

@Schema({ timestamps: true })
export class Promo {
  @ApiProperty({ example: 'New User' })
  @Prop({ required: true })
  badge: string;

  @ApiProperty({ example: 'First time User' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Enjoy 15% Off' })
  @Prop({ required: true })
  subtitle: string;

  @ApiProperty({ example: '* Order on above $150' })
  @Prop({ default: null })
  note: string;

  @ApiProperty({ example: ['#E8453C', '#F5A623'] })
  @Prop({ type: [String], required: true })
  colors: string[];

  @ApiProperty({ example: 'https://cdn.fooddash.com/promos/new-user.jpg' })
  @Prop({ default: null })
  image: string;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-03-01T00:00:00Z' })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({ example: '2026-03-31T23:59:59Z' })
  @Prop({ required: true })
  endDate: Date;
}

export const PromoSchema = SchemaFactory.createForClass(Promo);
