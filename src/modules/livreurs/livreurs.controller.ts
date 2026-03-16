import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LivreursService } from './livreurs.service';
import { CreateLivreurDto, UpdateLivreurDto } from './dto/create-livreur.dto';
import { PaginationQueryDto } from '../../common/pagination.dto';
import {
  successResponse,
  paginatedResponse,
} from '../../common/api-response.helper';

@ApiTags('Livreurs')
@Controller('api/livreurs')
export class LivreursController {
  constructor(private readonly livreursService: LivreursService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un livreur' })
  @ApiResponse({ status: 201, description: 'Livreur créé' })
  async create(@Body() dto: CreateLivreurDto) {
    const livreur = await this.livreursService.create(dto);
    return successResponse(livreur, 'Livreur créé avec succès');
  }

  @Get()
  @ApiOperation({ summary: 'Liste des livreurs' })
  @ApiResponse({ status: 200, description: 'Liste des livreurs' })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.livreursService.findAll(query.page, query.limit);
    return paginatedResponse(result.data, result.pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'un livreur" })
  @ApiResponse({ status: 200, description: 'Livreur trouvé' })
  async findOne(@Param('id') id: string) {
    const livreur = await this.livreursService.findOne(id);
    return successResponse(livreur);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un livreur' })
  @ApiResponse({ status: 200, description: 'Livreur modifié' })
  async update(@Param('id') id: string, @Body() dto: UpdateLivreurDto) {
    const livreur = await this.livreursService.update(id, dto);
    return successResponse(livreur, 'Livreur modifié avec succès');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un livreur' })
  @ApiResponse({ status: 200, description: 'Livreur supprimé' })
  async remove(@Param('id') id: string) {
    const result = await this.livreursService.remove(id);
    return successResponse(result, 'Livreur supprimé avec succès');
  }
}
