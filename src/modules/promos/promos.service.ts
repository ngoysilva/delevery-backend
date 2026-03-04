import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Promo, PromoDocument } from '../../schemas/promo.schema';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';

@Injectable()
export class PromosService {
  constructor(
    @InjectModel(Promo.name) private promoModel: Model<PromoDocument>,
  ) {}

  async findActive() {
    const now = new Date();
    return this.promoModel
      .find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.promoModel.findById(id).exec();
  }

  async create(dto: CreatePromoDto) {
    const promo = new this.promoModel(dto);
    return promo.save();
  }

  async update(id: string, dto: UpdatePromoDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La promo avec l'id ${id} n'existe pas`,
      });
    }
    const promo = await this.promoModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!promo) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La promo avec l'id ${id} n'existe pas`,
      });
    }
    return promo;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La promo avec l'id ${id} n'existe pas`,
      });
    }
    const result = await this.promoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La promo avec l'id ${id} n'existe pas`,
      });
    }
  }
}
