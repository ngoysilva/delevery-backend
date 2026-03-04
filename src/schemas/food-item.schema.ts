import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type FoodItemDocument = FoodItem & Document;

@Schema({ timestamps: true })
export class FoodItem {
  @ApiProperty({ example: 'Salad With Shirataki' })
  @Prop({ required: true })
  nom: string;

  @ApiProperty({ example: 'The flavor of salad with shirataki...' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: ['https://cdn.fooddash.com/food/salad-1.jpg'] })
  @Prop({ type: [String], required: true })
  images: string[];

  @ApiProperty({ example: 40500 })
  @Prop({ required: true })
  prix: number;

  @ApiProperty({ example: 80000, nullable: true })
  @Prop({ default: null })
  ancienPrix: number;

  @ApiProperty({ example: '50% OFF', nullable: true })
  @Prop({ default: null })
  discount: string;

  @ApiProperty({ example: 4.0 })
  @Prop({ required: true, min: 0, max: 5 })
  note: number;

  @ApiProperty({ example: '60f7b2d...' })
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @ApiProperty({ example: '60f7b2d...' })
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId: Types.ObjectId;

  @ApiProperty({ example: 'Handmade Restaurant' })
  @Prop({ required: true })
  restaurantName: string;

  @ApiProperty({ example: '2 km' })
  @Prop({ required: true })
  distance: string;

  @ApiProperty({ example: '10 min' })
  @Prop({ required: true })
  deliveryTime: string;

  @ApiProperty({ example: ['Normal', 'Large'] })
  @Prop({ type: [String], default: ['Normal', 'Large'] })
  sizes: string[];

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isAvailable: boolean;

  @ApiProperty({
    enum: ['recommended', 'popular', 'both'],
    example: 'recommended',
  })
  @Prop({ enum: ['recommended', 'popular', 'both'], default: 'recommended' })
  type: string;
}

export const FoodItemSchema = SchemaFactory.createForClass(FoodItem);
FoodItemSchema.index({ categoryId: 1 });
FoodItemSchema.index({ type: 1 });
FoodItemSchema.index({ isAvailable: 1 });
