import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartItem, CartItemDocument } from '../../schemas/cart-item.schema';
import { FoodItem, FoodItemDocument } from '../../schemas/food-item.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name) private cartModel: Model<CartItemDocument>,
    @InjectModel(FoodItem.name) private foodModel: Model<FoodItemDocument>,
  ) {}

  async getCart(userId: string) {
    const items = await this.cartModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.prix * item.quantity,
      0,
    );
    return { items, totalItems, totalPrice };
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    if (!Types.ObjectId.isValid(dto.foodId)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le plat avec l'id ${dto.foodId} n'existe pas`,
      });
    }

    const food = await this.foodModel.findById(dto.foodId).exec();
    if (!food) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le plat avec l'id ${dto.foodId} n'existe pas`,
      });
    }
    if (!food.isAvailable) {
      throw new BadRequestException({
        errorCode: 'INSUFFICIENT_STOCK',
        message: `Ce plat n'est plus disponible`,
      });
    }
    if (!food.sizes.includes(dto.size)) {
      throw new BadRequestException({
        errorCode: 'VALIDATION_ERROR',
        message: `La taille "${dto.size}" n'est pas disponible pour ce plat`,
        details: [
          {
            field: 'size',
            message: `Valeurs possibles: ${food.sizes.join(', ')}`,
          },
        ],
      });
    }

    const existing = await this.cartModel
      .findOne({
        userId: new Types.ObjectId(userId),
        foodId: new Types.ObjectId(dto.foodId),
        size: dto.size,
      })
      .exec();

    if (existing) {
      throw new ConflictException({
        errorCode: 'ALREADY_EXISTS',
        message: `Cet article (${dto.size}) existe déjà dans votre panier. Modifiez la quantité depuis le panier.`,
      });
    }

    const cartItem = new this.cartModel({
      userId: new Types.ObjectId(userId),
      foodId: new Types.ObjectId(dto.foodId),
      nom: food.nom,
      image: food.images[0] || '',
      prix: food.prix,
      size: dto.size,
      quantity: dto.quantity,
    });

    return cartItem.save();
  }

  async updateQuantity(userId: string, itemId: string, dto: UpdateCartDto) {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Article introuvable`,
      });
    }

    const item = await this.cartModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(itemId), userId: new Types.ObjectId(userId) },
        { quantity: dto.quantity },
        { new: true },
      )
      .exec();

    if (!item) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Article introuvable dans le panier`,
      });
    }
    return item;
  }

  async removeItem(userId: string, itemId: string) {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Article introuvable`,
      });
    }

    const result = await this.cartModel
      .findOneAndDelete({
        _id: new Types.ObjectId(itemId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!result) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Article introuvable dans le panier`,
      });
    }
  }

  async clearCart(userId: string) {
    await this.cartModel
      .deleteMany({ userId: new Types.ObjectId(userId) })
      .exec();
  }
}
