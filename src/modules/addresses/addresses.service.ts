import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, AddressDocument } from '../../schemas/address.schema';
import { CreateAddressDto, UpdateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId) },
        { isDefault: false },
      );
    }

    const count = await this.addressModel.countDocuments({
      userId: new Types.ObjectId(userId),
    });

    return this.addressModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      isDefault: dto.isDefault || count === 0,
    });
  }

  async findAllByUser(userId: string) {
    return this.addressModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string) {
    const address = await this.addressModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!address) {
      throw new NotFoundException('Adresse introuvable');
    }
    return address;
  }

  async update(id: string, userId: string, dto: UpdateAddressDto) {
    if (dto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId) },
        { isDefault: false },
      );
    }

    const address = await this.addressModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      dto,
      { new: true },
    );
    if (!address) {
      throw new NotFoundException('Adresse introuvable');
    }
    return address;
  }

  async remove(id: string, userId: string) {
    const address = await this.addressModel.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!address) {
      throw new NotFoundException('Adresse introuvable');
    }

    if (address.isDefault) {
      const next = await this.addressModel.findOne({
        userId: new Types.ObjectId(userId),
      });
      if (next) {
        next.isDefault = true;
        await next.save();
      }
    }

    return address;
  }

  async setDefault(id: string, userId: string) {
    await this.addressModel.updateMany(
      { userId: new Types.ObjectId(userId) },
      { isDefault: false },
    );
    const address = await this.addressModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      { isDefault: true },
      { new: true },
    );
    if (!address) {
      throw new NotFoundException('Adresse introuvable');
    }
    return address;
  }
}
