import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { successResponse } from '../../common/api-response.helper';

const TEMP_USER_ID = '000000000000000000000001';

@ApiTags('Cart')
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Contenu du panier' })
  @ApiResponse({ status: 200, description: 'Contenu du panier' })
  async getCart() {
    const cart = await this.cartService.getCart(TEMP_USER_ID);
    return successResponse(cart);
  }

  @Post('add')
  @HttpCode(201)
  @ApiOperation({ summary: 'Ajouter un article au panier' })
  @ApiResponse({ status: 201, description: 'Article ajouté' })
  @ApiResponse({ status: 409, description: 'Article déjà dans le panier' })
  async addToCart(@Body() dto: AddToCartDto) {
    const item = await this.cartService.addToCart(TEMP_USER_ID, dto);
    return successResponse(item, 'Article ajouté au panier');
  }

  @Put(':itemId')
  @ApiOperation({ summary: "Modifier la quantité d'un article" })
  @ApiResponse({ status: 200, description: 'Quantité mise à jour' })
  async updateQuantity(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartDto,
  ) {
    const item = await this.cartService.updateQuantity(
      TEMP_USER_ID,
      itemId,
      dto,
    );
    return successResponse(item, 'Quantité mise à jour');
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Supprimer un article du panier' })
  @ApiResponse({ status: 200, description: 'Article supprimé' })
  async removeItem(@Param('itemId') itemId: string) {
    await this.cartService.removeItem(TEMP_USER_ID, itemId);
    return successResponse(null, 'Article supprimé du panier');
  }

  @Delete()
  @ApiOperation({ summary: 'Vider le panier' })
  @ApiResponse({ status: 200, description: 'Panier vidé' })
  async clearCart() {
    await this.cartService.clearCart(TEMP_USER_ID);
    return successResponse(null, 'Panier vidé');
  }
}
