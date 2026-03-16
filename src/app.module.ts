import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './modules/categories/categories.module';
import { FoodsModule } from './modules/foods/foods.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PromosModule } from './modules/promos/promos.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';
import { SeedModule } from './modules/seed/seed.module';
import { UploadModule } from './modules/upload/upload.module';
import { OtpModule } from './modules/otp/otp.module';
import { AuthModule } from './modules/auth/auth.module';
import { LivreursModule } from './modules/livreurs/livreurs.module';
import { AddressesModule } from './modules/addresses/addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/fooddash',
    ),
    CategoriesModule,
    FoodsModule,
    CartModule,
    OrdersModule,
    PromosModule,
    PaymentMethodsModule,
    SeedModule,
    UploadModule,
    OtpModule,
    AuthModule,
    LivreursModule,
    AddressesModule,
  ],
})
export class AppModule {}
