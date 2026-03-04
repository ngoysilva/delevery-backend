import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../schemas/order.schema';
import { FoodItem, FoodItemSchema } from '../../schemas/food-item.schema';
import { CartItem, CartItemSchema } from '../../schemas/cart-item.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: FoodItem.name, schema: FoodItemSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
