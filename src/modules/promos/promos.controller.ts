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
import { PromosService } from './promos.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { successResponse } from '../../common/api-response.helper';

@ApiTags('Promos')
@Controller('api/promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Get('list')
  @ApiOperation({ summary: 'Liste de toutes les promos (backoffice)' })
  @ApiResponse({ status: 200, description: 'Liste des promos' })
  async findAll() {
    const promos = await this.promosService.findAll();
    return successResponse(promos);
  }

  @Get()
  @ApiOperation({ summary: 'Bannières promotionnelles actives (app mobile)' })
  @ApiResponse({ status: 200, description: 'Liste des promos actives et dans la période' })
  async findActive() {
    const promos = await this.promosService.findActive();
    return successResponse(promos);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une promo" })
  @ApiResponse({ status: 200, description: 'Promo trouvée' })
  @ApiResponse({ status: 404, description: 'Promo introuvable' })
  async findOne(@Param('id') id: string) {
    const promo = await this.promosService.findOne(id);
    if (!promo) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La promo avec l'id ${id} n'existe pas`,
      });
    }
    return successResponse(promo);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer une promo' })
  @ApiResponse({ status: 201, description: 'Promo créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() dto: CreatePromoDto) {
    const promo = await this.promosService.create(dto);
    return successResponse(promo, 'Promo créée avec succès');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une promo' })
  @ApiResponse({ status: 200, description: 'Promo mise à jour' })
  @ApiResponse({ status: 404, description: 'Promo introuvable' })
  async update(@Param('id') id: string, @Body() dto: UpdatePromoDto) {
    const promo = await this.promosService.update(id, dto);
    return successResponse(promo, 'Promo mise à jour');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une promo' })
  @ApiResponse({ status: 200, description: 'Promo supprimée' })
  @ApiResponse({ status: 404, description: 'Promo introuvable' })
  async remove(@Param('id') id: string) {
    await this.promosService.remove(id);
    return successResponse(null, 'Promo supprimée');
  }
}
