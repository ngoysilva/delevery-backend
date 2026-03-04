import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CartItemDocument = CartItem & Document;

@Schema({ timestamps: true })
export class CartItem {
  @ApiProperty({ example: '60f7b2d...' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({ example: '60f7b2d...' })
  @Prop({ type: Types.ObjectId, ref: 'FoodItem', required: true })
  foodId: Types.ObjectId;

  @ApiProperty({ example: 'Sprouts Egg' })
  @Prop({ required: true })
  nom: string;

  @ApiProperty({ example: 'https://cdn.fooddash.com/food/sprouts-egg-1.jpg' })
  @Prop({ required: true })
  image: string;

  @ApiProperty({ example: 10 })
  @Prop({ required: true })
  prix: number;

  @ApiProperty({ example: 'Normal' })
  @Prop({ required: true })
  size: string;

  @ApiProperty({ example: 3, minimum: 1, maximum: 99 })
  @Prop({ required: true, min: 1, max: 99 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
CartItemSchema.index({ userId: 1 });
CartItemSchema.index({ userId: 1, foodId: 1, size: 1 }, { unique: true });
