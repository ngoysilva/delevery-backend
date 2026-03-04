import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PaymentMethod,
  PaymentMethodDocument,
} from '../../schemas/payment-method.schema';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private pmModel: Model<PaymentMethodDocument>,
  ) {}

  async findAll() {
    return this.pmModel.find({ isActive: true }).exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.pmModel.findById(id).exec();
  }

  async create(dto: CreatePaymentMethodDto) {
    const pm = new this.pmModel(dto);
    return pm.save();
  }

  async update(id: string, dto: UpdatePaymentMethodDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le moyen de paiement avec l'id ${id} n'existe pas`,
      });
    }
    const pm = await this.pmModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!pm) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le moyen de paiement avec l'id ${id} n'existe pas`,
      });
    }
    return pm;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le moyen de paiement avec l'id ${id} n'existe pas`,
      });
    }
    const result = await this.pmModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le moyen de paiement avec l'id ${id} n'existe pas`,
      });
    }
  }
}
