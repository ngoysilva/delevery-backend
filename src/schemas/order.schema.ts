import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty({ example: '60f7b2d...' })
  foodId: Types.ObjectId;

  @ApiProperty({ example: 'Sprouts Egg' })
  nom: string;

  @ApiProperty({ example: 'https://cdn.fooddash.com/food/sprouts-egg-1.jpg' })
  image: string;

  @ApiProperty({ example: 10 })
  prix: number;

  @ApiProperty({ example: 'Normal' })
  size: string;

  @ApiProperty({ example: 3 })
  quantity: number;
}

export class DeliveryAddress {
  @ApiProperty({ example: -4.3217 })
  latitude: number;

  @ApiProperty({ example: 15.3125 })
  longitude: number;

  @ApiProperty({ example: '123 Avenue de la Paix, Kinshasa' })
  address: string;
}

export class RestaurantLocation {
  @ApiProperty({ example: -4.315 })
  latitude: number;

  @ApiProperty({ example: 15.308 })
  longitude: number;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @ApiProperty({ example: '60f7b2d...' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        foodId: { type: Types.ObjectId, ref: 'FoodItem' },
        nom: String,
        image: String,
        prix: Number,
        size: String,
        quantity: Number,
      },
    ],
    required: true,
  })
  items: OrderItem[];

  @ApiProperty({ example: 40 })
  @Prop({ required: true })
  total: number;

  @ApiProperty({ example: 'M-Pesa' })
  @Prop({ required: true })
  paymentMethod: string;

  @ApiProperty({ example: '0991234567' })
  @Prop({ required: true })
  phoneNumber: string;

  @ApiProperty({
    enum: ['pending', 'confirmed', 'preparing', 'delivered'],
    example: 'pending',
  })
  @Prop({
    enum: ['pending', 'confirmed', 'preparing', 'delivered'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: { latitude: Number, longitude: Number, address: String },
    required: true,
  })
  deliveryAddress: DeliveryAddress;

  @Prop({
    type: { latitude: Number, longitude: Number },
    default: null,
  })
  restaurantLocation: RestaurantLocation;

  @ApiProperty({ nullable: true })
  @Prop({ default: null })
  confirmedAt: Date;

  @ApiProperty({ nullable: true })
  @Prop({ default: null })
  deliveredAt: Date;

  @ApiProperty({ nullable: true })
  @Prop({ default: null })
  qrCode: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
