import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, ToggleCategoryStatusDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import {
  successResponse,
  paginatedResponse,
} from '../../common/api-response.helper';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste de toutes les catégories' })
  @ApiResponse({ status: 200, description: 'Liste des catégories' })
  async findAll(@Query() query: CategoryQueryDto) {
    const result = await this.categoriesService.findAll(
      query.page,
      query.limit,
      query.status,
    );
    return paginatedResponse(result.data, result.pagination);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques des catégories' })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  async getStats() {
    const stats = await this.categoriesService.getStats();
    return successResponse(stats);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une catégorie" })
  @ApiResponse({ status: 200, description: 'Catégorie trouvée' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }
    return successResponse(category);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer une catégorie' })
  @ApiResponse({ status: 201, description: 'Catégorie créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    return successResponse(category, 'Catégorie créée avec succès');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une catégorie' })
  @ApiResponse({ status: 200, description: 'Catégorie mise à jour' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, dto);
    return successResponse(category, 'Catégorie mise à jour');
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activer ou suspendre une catégorie' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() dto: ToggleCategoryStatusDto,
  ) {
    const category = await this.categoriesService.toggleStatus(id, dto.status);
    return successResponse(category, 'Statut mis à jour');
  }

  @Post('sync-food-counts')
  @HttpCode(200)
  @ApiOperation({ summary: 'Synchroniser les compteurs de plats' })
  @ApiResponse({
    status: 200,
    description: 'Compteurs synchronisés',
  })
  async syncFoodCounts() {
    await this.categoriesService.syncFoodCounts();
    return successResponse(null, 'Compteurs synchronisés avec succès');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiResponse({ status: 200, description: 'Catégorie supprimée' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return successResponse(null, 'Catégorie supprimée');
  }
}
