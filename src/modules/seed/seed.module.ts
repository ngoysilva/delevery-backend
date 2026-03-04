import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../../schemas/category.schema';
import { Restaurant, RestaurantSchema } from '../../schemas/restaurant.schema';
import { FoodItem, FoodItemSchema } from '../../schemas/food-item.schema';
import { Promo, PromoSchema } from '../../schemas/promo.schema';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from '../../schemas/payment-method.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: FoodItem.name, schema: FoodItemSchema },
      { name: Promo.name, schema: PromoSchema },
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
