import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
  NotFoundException,
  BadRequestException,
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

@ApiTags('Orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer une commande' })
  @ApiResponse({ status: 201, description: 'Commande créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      throw new BadRequestException({
        errorCode: 'AUTH_REQUIRED',
        message: 'Vous devez être connecté pour passer une commande',
      });
    }
    const order = await this.ordersService.create(userId, dto);
    return successResponse(order, 'Commande créée avec succès');
  }

  @Get()
  @ApiOperation({ summary: 'Historique des commandes' })
  @ApiResponse({ status: 200, description: 'Liste des commandes' })
  async findAll(@Req() req: any, @Query() query: PaginationQueryDto) {
    const userId = req.headers['x-user-id'] || null;
    const result = await this.ordersService.findAll(
      userId,
      query.page,
      query.limit,
    );
    return paginatedResponse(result.data, result.pagination);
  }

  @Get('delivery/my-orders')
  @ApiOperation({ summary: 'Commandes assignées au livreur' })
  async getDeliveryOrders(@Req() req: any, @Query() query: PaginationQueryDto) {
    const userId = req.headers['x-user-id'];
    if (!userId) throw new BadRequestException({ errorCode: 'AUTH_REQUIRED', message: 'Connectez-vous' });
    const result = await this.ordersService.getDeliveryOrders(userId, query.page, query.limit);
    return paginatedResponse(result.data, result.pagination);
  }

  @Get('delivery/history')
  @ApiOperation({ summary: 'Historique livraisons du livreur' })
  async getDeliveryHistory(@Req() req: any, @Query() query: PaginationQueryDto) {
    const userId = req.headers['x-user-id'];
    if (!userId) throw new BadRequestException({ errorCode: 'AUTH_REQUIRED', message: 'Connectez-vous' });
    const result = await this.ordersService.getDeliveryHistory(userId, query.page, query.limit);
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

  @Put(':id/status')
  @ApiOperation({ summary: 'Avancer le statut de la commande' })
  async updateStatus(@Param('id') id: string, @Body() body: { status?: string }) {
    const order = await this.ordersService.updateStatus(id, body.status);
    return successResponse(order, `Statut mis à jour: ${order.status}`);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assigner un livreur' })
  async assignDelivery(@Param('id') id: string, @Body() body: { deliveryPersonId: string }) {
    const order = await this.ordersService.assignDelivery(id, body.deliveryPersonId);
    return successResponse(order, 'Livreur assigné');
  }

  @Post('delivery/scan')
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirmer livraison par QR code' })
  async confirmByQr(@Body() body: { qrCode: string }) {
    const order = await this.ordersService.confirmByQrCode(body.qrCode);
    return successResponse(order, 'Livraison confirmée');
  }
}
