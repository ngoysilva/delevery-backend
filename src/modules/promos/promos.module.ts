import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Promo, PromoSchema } from '../../schemas/promo.schema';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Promo.name, schema: PromoSchema }]),
  ],
  controllers: [PromosController],
  providers: [PromosService],
})
export class PromosModule {}
