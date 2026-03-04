import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { successResponse } from '../../common/api-response.helper';

@ApiTags('Payment Methods')
@Controller('api/payment-methods')
export class PaymentMethodsController {
  constructor(private readonly pmService: PaymentMethodsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des moyens de paiement disponibles' })
  @ApiResponse({ status: 200, description: 'Moyens de paiement' })
  async findAll() {
    const methods = await this.pmService.findAll();
    return successResponse(methods);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'un moyen de paiement" })
  @ApiResponse({ status: 200, description: 'Moyen de paiement trouvé' })
  @ApiResponse({ status: 404, description: 'Moyen de paiement introuvable' })
  async findOne(@Param('id') id: string) {
    const pm = await this.pmService.findOne(id);
    if (!pm) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le moyen de paiement avec l'id ${id} n'existe pas`,
      });
    }
    return successResponse(pm);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un moyen de paiement' })
  @ApiResponse({ status: 201, description: 'Moyen de paiement créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() dto: CreatePaymentMethodDto) {
    const pm = await this.pmService.create(dto);
    return successResponse(pm, 'Moyen de paiement créé avec succès');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un moyen de paiement' })
  @ApiResponse({ status: 200, description: 'Moyen de paiement mis à jour' })
  @ApiResponse({ status: 404, description: 'Moyen de paiement introuvable' })
  async update(@Param('id') id: string, @Body() dto: UpdatePaymentMethodDto) {
    const pm = await this.pmService.update(id, dto);
    return successResponse(pm, 'Moyen de paiement mis à jour');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un moyen de paiement' })
  @ApiResponse({ status: 200, description: 'Moyen de paiement supprimé' })
  @ApiResponse({ status: 404, description: 'Moyen de paiement introuvable' })
  async remove(@Param('id') id: string) {
    await this.pmService.remove(id);
    return successResponse(null, 'Moyen de paiement supprimé');
  }
}
