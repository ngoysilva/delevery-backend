import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationQueryDto } from '../../common/pagination.dto';
import {
  successResponse,
  paginatedResponse,
} from '../../common/api-response.helper';

const TEMP_USER_ID = '000000000000000000000001';

@ApiTags('Orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer une commande' })
  @ApiResponse({ status: 201, description: 'Commande créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.ordersService.create(TEMP_USER_ID, dto);
    return successResponse(order, 'Commande créée avec succès');
  }

  @Get()
  @ApiOperation({ summary: 'Historique des commandes' })
  @ApiResponse({ status: 200, description: 'Liste des commandes' })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.ordersService.findAll(
      TEMP_USER_ID,
      query.page,
      query.limit,
    );
    return paginatedResponse(result.data, result.pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une commande" })
  @ApiResponse({ status: 200, description: 'Commande trouvée' })
  @ApiResponse({ status: 404, description: 'Commande introuvable' })
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La commande avec l'id ${id} n'existe pas`,
      });
    }
    return successResponse(order);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: "Confirmer la réception d'une commande" })
  @ApiResponse({ status: 200, description: 'Réception confirmée' })
  @ApiResponse({ status: 404, description: 'Commande introuvable' })
  @ApiResponse({ status: 409, description: 'Commande déjà livrée' })
  async confirmDelivery(@Param('id') id: string) {
    const order = await this.ordersService.confirmDelivery(id);
    return successResponse(
      {
        id: order._id,
        status: order.status,
        deliveredAt: order.deliveredAt,
        qrCode: order.qrCode,
      },
      'Réception confirmée',
    );
  }
}
