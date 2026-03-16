import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import {
  Restaurant,
  RestaurantDocument,
} from '../../schemas/restaurant.schema';
import { FoodItem, FoodItemDocument } from '../../schemas/food-item.schema';
import { Promo, PromoDocument } from '../../schemas/promo.schema';
import {
  PaymentMethod,
  PaymentMethodDocument,
} from '../../schemas/payment-method.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(FoodItem.name) private foodModel: Model<FoodItemDocument>,
    @InjectModel(Promo.name) private promoModel: Model<PromoDocument>,
    @InjectModel(PaymentMethod.name)
    private pmModel: Model<PaymentMethodDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async seed() {
    await Promise.all([
      this.categoryModel.deleteMany({}),
      this.restaurantModel.deleteMany({}),
      this.foodModel.deleteMany({}),
      this.promoModel.deleteMany({}),
      this.pmModel.deleteMany({}),
      this.userModel.deleteMany({}),
    ]);

    await this.userModel.create({
      _id: '000000000000000000000001',
      name: 'Jean Mukendi',
      email: 'jean.mukendi@email.com',
      phone: '+243991234567',
    });

    const categories = await this.categoryModel.insertMany([
      {
        nom: 'Continental',
        image:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
      },
      {
        nom: 'Beverages',
        image:
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200',
      },
      {
        nom: 'Italian',
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200',
      },
      {
        nom: 'Desserts',
        image:
          'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200',
      },
      {
        nom: 'Chinese',
        image:
          'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200',
      },
      {
        nom: 'Japanese',
        image:
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200',
      },
      {
        nom: 'American',
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
      },
      {
        nom: 'French',
        image:
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200',
      },
    ]);

    const restaurants = await this.restaurantModel.insertMany([
      { name: 'Green Kitchen', latitude: -4.315, longitude: 15.308 },
      { name: 'Keratoen Salad', latitude: -4.318, longitude: 15.312 },
      { name: 'Handmade Restaurant', latitude: -4.31, longitude: 15.305 },
      { name: 'Fresh Kitchen', latitude: -4.32, longitude: 15.315 },
      { name: 'Mama Africa', latitude: -4.325, longitude: 15.31 },
    ]);

    const foods = await this.foodModel.insertMany([
      {
        nom: 'Sprouts Egg',
        description:
          'Fresh sprouts combined with perfectly cooked eggs create a nutritious and satisfying meal.',
        images: [
          'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
        ],
        prix: 10,
        note: 4,
        categoryId: categories[0]._id,
        restaurantId: restaurants[0]._id,
        restaurantName: 'Green Kitchen',
        distance: '2 km',
        deliveryTime: '10 min',
        sizes: ['Normal', 'Large'],
        type: 'recommended',
      },
      {
        nom: 'Sprouts Salad',
        description:
          'A refreshing salad made with fresh sprouts, mixed greens, and a light vinaigrette dressing.',
        images: [
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        ],
        prix: 10,
        note: 5,
        categoryId: categories[0]._id,
        restaurantId: restaurants[1]._id,
        restaurantName: 'Keratoen Salad',
        distance: '1.5 km',
        deliveryTime: '12 min',
        sizes: ['Normal', 'Large'],
        type: 'recommended',
      },
      {
        nom: 'Salad With Shirataki',
        description:
          'The flavor of salad with shirataki taste much like vegetable and regular pasta.',
        images: [
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
        ],
        prix: 40500,
        note: 4,
        categoryId: categories[0]._id,
        restaurantId: restaurants[2]._id,
        restaurantName: 'Handmade Restaurant',
        distance: '2 km',
        deliveryTime: '10 min',
        sizes: ['Normal', 'Large'],
        type: 'recommended',
      },
      {
        nom: 'Greek Salad',
        description:
          'A classic Greek salad with fresh tomatoes, cucumber, red onion, olives, and feta cheese.',
        images: [
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        ],
        prix: 40000,
        ancienPrix: 80000,
        discount: '50% OFF',
        note: 5,
        categoryId: categories[0]._id,
        restaurantId: restaurants[1]._id,
        restaurantName: 'Keratoen Salad',
        distance: '3.5 km',
        deliveryTime: '20 min',
        sizes: ['Normal', 'Large'],
        type: 'popular',
      },
      {
        nom: 'Chicken Bowl',
        description:
          'Grilled chicken breast served over a bed of fluffy rice with steamed vegetables.',
        images: [
          'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
        ],
        prix: 28000,
        ancienPrix: 45000,
        discount: '38% OFF',
        note: 4,
        categoryId: categories[6]._id,
        restaurantId: restaurants[3]._id,
        restaurantName: 'Fresh Kitchen',
        distance: '2.5 km',
        deliveryTime: '18 min',
        sizes: ['Normal', 'Large'],
        type: 'popular',
      },
      {
        nom: 'Margherita Pizza',
        description:
          'Classic Italian pizza with fresh mozzarella, tomatoes, and basil on a crispy thin crust.',
        images: [
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        ],
        prix: 35000,
        ancienPrix: 50000,
        discount: '30% OFF',
        note: 5,
        categoryId: categories[2]._id,
        restaurantId: restaurants[2]._id,
        restaurantName: 'Handmade Restaurant',
        distance: '3 km',
        deliveryTime: '25 min',
        sizes: ['Normal', 'Large'],
        type: 'both',
      },
      {
        nom: 'Sushi Roll',
        description:
          'Fresh salmon and avocado rolled in perfectly seasoned sushi rice and nori seaweed.',
        images: [
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
        ],
        prix: 55000,
        note: 5,
        categoryId: categories[5]._id,
        restaurantId: restaurants[4]._id,
        restaurantName: 'Mama Africa',
        distance: '4 km',
        deliveryTime: '30 min',
        sizes: ['Normal', 'Large'],
        type: 'recommended',
      },
      {
        nom: 'Chocolate Cake',
        description:
          'Rich and moist chocolate cake layered with creamy chocolate ganache.',
        images: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        ],
        prix: 15000,
        note: 4,
        categoryId: categories[3]._id,
        restaurantId: restaurants[3]._id,
        restaurantName: 'Fresh Kitchen',
        distance: '2.5 km',
        deliveryTime: '15 min',
        sizes: ['Normal', 'Large'],
        type: 'recommended',
      },
      {
        nom: 'Kung Pao Chicken',
        description:
          'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers in a savory sauce.',
        images: [
          'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
        ],
        prix: 32000,
        ancienPrix: 42000,
        discount: '24% OFF',
        note: 4,
        categoryId: categories[4]._id,
        restaurantId: restaurants[4]._id,
        restaurantName: 'Mama Africa',
        distance: '4 km',
        deliveryTime: '22 min',
        sizes: ['Normal', 'Large'],
        type: 'popular',
      },
      {
        nom: 'Classic Burger',
        description:
          'Juicy beef patty with lettuce, tomato, pickles, and special sauce on a toasted bun.',
        images: [
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        ],
        prix: 22000,
        note: 4,
        categoryId: categories[6]._id,
        restaurantId: restaurants[3]._id,
        restaurantName: 'Fresh Kitchen',
        distance: '2.5 km',
        deliveryTime: '15 min',
        sizes: ['Normal', 'Large'],
        type: 'both',
      },
      {
        nom: 'Fresh Lemonade',
        description:
          'Refreshing homemade lemonade with fresh lemons, mint, and a touch of honey.',
        images: [
          'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
        ],
        prix: 5000,
        note: 4,
        categoryId: categories[1]._id,
        restaurantId: restaurants[0]._id,
        restaurantName: 'Green Kitchen',
        distance: '2 km',
        deliveryTime: '5 min',
        sizes: ['Normal', 'Large'],
        type: 'recommended',
      },
      {
        nom: 'Crème Brûlée',
        description:
          'Classic French custard dessert with a caramelized sugar top and rich vanilla flavor.',
        images: [
          'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400',
        ],
        prix: 18000,
        note: 5,
        categoryId: categories[7]._id,
        restaurantId: restaurants[2]._id,
        restaurantName: 'Handmade Restaurant',
        distance: '3 km',
        deliveryTime: '20 min',
        sizes: ['Normal', 'Large'],
        type: 'both',
      },
    ]);

    const promos = await this.promoModel.insertMany([
      {
        badge: 'New User',
        title: 'First time User',
        subtitle: 'Enjoy 15% Off',
        note: '* Order on above $150',
        colors: ['#E8453C', '#F5A623'],
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        isActive: true,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
      {
        badge: 'Weekend',
        title: 'Weekend Special',
        subtitle: 'Free Delivery',
        note: '* On orders above $50',
        colors: ['#4CAF50', '#2196F3'],
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        isActive: true,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
      {
        badge: 'Flash Sale',
        title: 'Flash Sale',
        subtitle: '30% Off All Items',
        note: '* Limited time offer',
        colors: ['#9C27B0', '#E91E63'],
        image:
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        isActive: true,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
    ]);

    const paymentMethods = await this.pmModel.insertMany([
      {
        name: 'Airtel Money',
        logo: 'https://i.pinimg.com/736x/fe/6d/5f/fe6d5fe2443668b417384ede46531bee.jpg',
        type: 'mobile_money',
        country: 'Congo (RDC)',
        countryCode: '+243',
        isActive: true,
      },
      {
        name: 'M-Pesa',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/200px-M-PESA_LOGO-01.svg.png',
        type: 'mobile_money',
        country: 'Congo (RDC)',
        countryCode: '+243',
        isActive: true,
      },
      {
        name: 'Orange Money',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
        type: 'mobile_money',
        country: 'Congo (RDC)',
        countryCode: '+243',
        isActive: true,
      },
    ]);

    return {
      users: 1,
      categories: categories.length,
      restaurants: restaurants.length,
      foods: foods.length,
      promos: promos.length,
      paymentMethods: paymentMethods.length,
    };
  }
}
