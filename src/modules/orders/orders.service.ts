import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { FoodItem, FoodItemDocument } from '../../schemas/food-item.schema';
import { CartItem, CartItemDocument } from '../../schemas/cart-item.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { buildPagination } from '../../common/pagination.dto';


@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(FoodItem.name) private foodModel: Model<FoodItemDocument>,
    @InjectModel(CartItem.name) private cartModel: Model<CartItemDocument>,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const orderItems: Array<{
      foodId: Types.ObjectId;
      nom: string;
      image: string;
      prix: number;
      size: string;
      quantity: number;
    }> = [];
    let total = 0;
    let restaurantLocation: { latitude: number; longitude: number } | null =
      null;

    for (const item of dto.items) {
      if (!Types.ObjectId.isValid(item.foodId)) {
        throw new BadRequestException({
          errorCode: 'VALIDATION_ERROR',
          message: `foodId invalide: ${item.foodId}`,
        });
      }
      const food = await this.foodModel.findById(item.foodId).exec();
      if (!food) {
        throw new NotFoundException({
          errorCode: 'NOT_FOUND',
          message: `Le plat avec l'id ${item.foodId} n'existe pas`,
        });
      }
      if (!food.isAvailable) {
        throw new BadRequestException({
          errorCode: 'INSUFFICIENT_STOCK',
          message: `Le plat "${food.nom}" n'est plus disponible`,
        });
      }
      if (!food.sizes.includes(item.size)) {
        throw new BadRequestException({
          errorCode: 'VALIDATION_ERROR',
          message: `Taille "${item.size}" invalide pour "${food.nom}"`,
        });
      }

      orderItems.push({
        foodId: food._id,
        nom: food.nom,
        image: food.images[0] || '',
        prix: food.prix,
        size: item.size,
        quantity: item.quantity,
      });

      total += food.prix * item.quantity;

      if (!restaurantLocation && food.restaurantId) {
        restaurantLocation = { latitude: -4.315, longitude: 15.308 };
      }
    }

    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      total,
      paymentMethod: dto.paymentMethod,
      phoneNumber: dto.phoneNumber,
      status: 'pending',
      deliveryAddress: dto.deliveryAddress,
      restaurantLocation: (restaurantLocation as {
        latitude: number;
        longitude: number;
      }) || {
        latitude: -4.315,
        longitude: 15.308,
      },
    });

    const qrCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    order.qrCode = qrCode;

    const saved = await order.save();

    await this.cartModel
      .deleteMany({ userId: new Types.ObjectId(userId) })
      .exec();

    return saved;
  }

  async findAll(userId: string | null, page: number = 1, limit: number = 20) {
    const filter: any = {};
    if (userId && Types.ObjectId.isValid(userId)) {
      filter.userId = new Types.ObjectId(userId);
    }
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate('deliveryPersonId', 'name phone avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return { data, pagination: buildPagination(page, limit, total) };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.orderModel
      .findById(id)
      .populate('deliveryPersonId', 'name phone avatar')
      .exec();
  }

  private static readonly STATUS_FLOW: Record<string, string> = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'en_route',
    en_route: 'delivered',
  };

  async updateStatus(id: string, newStatus?: string) {
    const order = await this.findOneOrFail(id);

    if (order.status === 'delivered') {
      throw new ConflictException({
        errorCode: 'ORDER_NOT_MODIFIABLE',
        message: 'Cette commande a déjà été livrée',
      });
    }

    const nextStatus = newStatus || OrdersService.STATUS_FLOW[order.status];
    if (!nextStatus) {
      throw new BadRequestException({
        errorCode: 'INVALID_STATUS',
        message: `Transition impossible depuis le statut "${order.status}"`,
      });
    }

    order.status = nextStatus;
    if (nextStatus === 'confirmed') order.confirmedAt = new Date();
    if (nextStatus === 'delivered') order.deliveredAt = new Date();

    return order.save();
  }

  async assignDelivery(orderId: string, deliveryPersonId: string) {
    const order = await this.findOneOrFail(orderId);

    if (!Types.ObjectId.isValid(deliveryPersonId)) {
      throw new BadRequestException({
        errorCode: 'VALIDATION_ERROR',
        message: 'ID livreur invalide',
      });
    }

    order.deliveryPersonId = new Types.ObjectId(deliveryPersonId);
    return order.save();
  }

  async getDeliveryOrders(
    deliveryPersonId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const filter = {
      deliveryPersonId: new Types.ObjectId(deliveryPersonId),
      status: { $ne: 'delivered' },
    };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return { data, pagination: buildPagination(page, limit, total) };
  }

  async getDeliveryHistory(
    deliveryPersonId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const filter = {
      deliveryPersonId: new Types.ObjectId(deliveryPersonId),
      status: 'delivered',
    };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.orderModel.find(filter)
        .populate('userId', 'name phone')
        .sort({ deliveredAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return { data, pagination: buildPagination(page, limit, total) };
  }

  async confirmByQrCode(qrCode: string) {
    const order = await this.orderModel.findOne({ qrCode }).exec();
    if (!order) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: 'Commande introuvable avec ce QR code',
      });
    }

    if (order.status === 'delivered') {
      throw new ConflictException({
        errorCode: 'ALREADY_DELIVERED',
        message: 'Cette commande a déjà été livrée',
      });
    }

    order.status = 'delivered';
    order.deliveredAt = new Date();
    return order.save();
  }

  private async findOneOrFail(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Commande introuvable`,
      });
    }
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Commande introuvable`,
      });
    }
    return order;
  }
}
