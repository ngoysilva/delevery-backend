import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FoodItem, FoodItemDocument } from '../../schemas/food-item.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { buildPagination } from '../../common/pagination.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(FoodItem.name) private foodModel: Model<FoodItemDocument>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    type?: string,
  ) {
    const filter: any = { isAvailable: true };

    if (categoryId) {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new NotFoundException({
          errorCode: 'NOT_FOUND',
          message: 'Catégorie invalide',
        });
      }
      filter.categoryId = new Types.ObjectId(categoryId);
    }

    if (type) {
      filter.$or = [{ type }, { type: 'both' }];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.foodModel.find(filter).skip(skip).limit(limit).exec(),
      this.foodModel.countDocuments(filter).exec(),
    ]);

    return { data, pagination: buildPagination(page, limit, total) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.foodModel.findById(id).exec();
  }

  async create(dto: CreateFoodDto) {
    const food = new this.foodModel({
      ...dto,
      categoryId: new Types.ObjectId(dto.categoryId),
      restaurantId: new Types.ObjectId(dto.restaurantId),
    });
    return food.save();
  }

  async update(id: string, dto: UpdateFoodDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le plat avec l'id ${id} n'existe pas`,
      });
    }

    const updateData: any = { ...dto };
    if (dto.categoryId)
      updateData.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.restaurantId)
      updateData.restaurantId = new Types.ObjectId(dto.restaurantId);

    const food = await this.foodModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!food) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le plat avec l'id ${id} n'existe pas`,
      });
    }
    return food;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le plat avec l'id ${id} n'existe pas`,
      });
    }
    const result = await this.foodModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le plat avec l'id ${id} n'existe pas`,
      });
    }
  }
}
