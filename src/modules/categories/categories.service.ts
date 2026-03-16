import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Category,
  CategoryDocument,
  CategoryStatus,
} from '../../schemas/category.schema';
import { FoodItem, FoodItemDocument } from '../../schemas/food-item.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { buildPagination } from '../../common/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @InjectModel(FoodItem.name)
    private foodItemModel: Model<FoodItemDocument>,
  ) {}

  async findAll(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      this.categoryModel.find(filter).skip(skip).limit(limit).exec(),
      this.categoryModel.countDocuments(filter).exec(),
    ]);
    return { data, pagination: buildPagination(page, limit, total) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.categoryModel.findById(id).exec();
  }

  async create(dto: CreateCategoryDto) {
    const category = new this.categoryModel({
      ...dto,
      status: CategoryStatus.INACTIVE,
      foodCount: 0,
    });
    return category.save();
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }
    const category = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }
    return category;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }
  }

  async toggleStatus(id: string, newStatus: 'active' | 'suspended') {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }

    if (newStatus === 'active' && category.foodCount === 0) {
      category.status = CategoryStatus.INACTIVE;
    } else if (newStatus === 'active') {
      category.status = CategoryStatus.ACTIVE;
    } else {
      category.status = CategoryStatus.SUSPENDED;
    }

    return category.save();
  }

  async syncFoodCounts() {
    const pipeline = [
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ];
    const counts = await this.foodItemModel.aggregate(pipeline).exec();

    const countMap = new Map<string, number>();
    for (const item of counts) {
      countMap.set(item._id.toString(), item.count);
    }

    const categories = await this.categoryModel.find().exec();
    const bulkOps = categories.map((cat) => {
      const newCount = countMap.get(cat._id.toString()) || 0;
      let newStatus = cat.status;

      if (cat.status !== CategoryStatus.SUSPENDED) {
        newStatus =
          newCount > 0 ? CategoryStatus.ACTIVE : CategoryStatus.INACTIVE;
      }

      return {
        updateOne: {
          filter: { _id: cat._id },
          update: { $set: { foodCount: newCount, status: newStatus } },
        },
      };
    });

    if (bulkOps.length > 0) {
      await this.categoryModel.bulkWrite(bulkOps);
    }
  }

  async getStats() {
    const [total, active, inactive, suspended, totalFoods] = await Promise.all([
      this.categoryModel.countDocuments().exec(),
      this.categoryModel
        .countDocuments({ status: CategoryStatus.ACTIVE })
        .exec(),
      this.categoryModel
        .countDocuments({ status: CategoryStatus.INACTIVE })
        .exec(),
      this.categoryModel
        .countDocuments({ status: CategoryStatus.SUSPENDED })
        .exec(),
      this.foodItemModel.countDocuments().exec(),
    ]);

    return { total, active, inactive, suspended, totalFoods };
  }
}
